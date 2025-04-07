#!/bin/bash

set -euo pipefail

# Default values
APP_NAME=""
LOCATION="westeurope"
CONTAINER_NAME="tfstate"
TFVARS_FILE="$(dirname "$0")/../terraform/terraform.tfvars" # Adjusted to be relative to the script's location

# Default flags
DRY_RUN=true
RUN_PROVISION=false
RUN_DESTROY=false
REUSE_STORAGE=false
POSTFIX=""

# Functions
function usage {
  echo -e "\033[1;36mUsage:\033[0m"
  echo "  $0 --app-name <name> --provision --postfix <name> [--no-dry-run] [--reuse]"
  echo "  $0 --app-name <name> --destroy   --postfix <name> [--no-dry-run]"
  echo "  $0 --help | --usage"
  echo
  echo "Options:"
  echo "  --app-name <name>   Name of the application (required)"
  echo "  --provision         Run infrastructure setup (default: dry run)"
  echo "  --destroy           Tear down infrastructure (default: dry run)"
  echo "  --postfix <name>    Required postfix to uniquely name storage account"
  echo "  --no-dry-run        Apply changes for real"
  echo "  --reuse             Reuse existing storage account if available"
  echo "  --help              Show detailed help"
  echo "  --usage             Show usage"
  echo
  echo "Examples:"
  echo "  $0 --app-name MyApp --provision --postfix myproject"
  echo "  $0 --app-name MyApp --destroy --postfix myproject --no-dry-run"
}

function help {
  echo -e "\033[1;36mAzure Terraform Environment Setup Script\033[0m"
  echo
  echo "This script provisions or destroys Azure infrastructure for Terraform state management:"
  echo "- Creates or deletes a resource group"
  echo "- Manages a service principal"
  echo "- Manages a unique Azure Storage account (with postfix)"
  echo "- Creates a storage container with uniqueness check"
  echo "- Generates terraform.tfvars"
  echo
  usage
}

function log {
  echo -e "\033[1;34m[INFO]\033[0m $1"
}

function warn {
  echo -e "\033[1;33m[WARN]\033[0m $1"
}

function error_exit {
  echo -e "\033[1;31m[ERROR]\033[0m $1"
  exit 1
}

# Parse arguments
if [[ $# -eq 0 ]]; then
  usage
  exit 0
fi

while [[ $# -gt 0 ]]; do
  case $1 in
    --app-name)
      APP_NAME="$2"
      shift 2
      ;;
    --provision)
      RUN_PROVISION=true
      shift
      ;;
    --destroy)
      RUN_DESTROY=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --no-dry-run)
      DRY_RUN=false
      shift
      ;;
    --reuse)
      REUSE_STORAGE=true
      shift
      ;;
    --postfix)
      POSTFIX="$2"
      shift 2
      ;;
    --help)
      help
      exit 0
      ;;
    --usage)
      usage
      exit 0
      ;;
    *)
      error_exit "Unknown option: $1. Use --help to see available options."
      ;;
  esac
done

# Validate APP_NAME
if [[ -z "$APP_NAME" ]]; then
  error_exit "Missing required option: --app-name <name>"
fi

# Construct RESOURCE_GROUP_NAME from APP_NAME
RESOURCE_GROUP_NAME="${APP_NAME,,}-rg" # Convert to lowercase and append '-rg'

# Validate POSTFIX
if [[ -z "$POSTFIX" ]]; then
  error_exit "Missing required option: --postfix <name>"
fi

STORAGE_ACCOUNT_NAME="terraform${POSTFIX,,}" # lowercase enforced
SP_DISPLAY_NAME="${APP_NAME} SP"
SP_SCOPE="/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP_NAME"

# Check required tools
command -v az >/dev/null || error_exit "Azure CLI not found."
command -v jq >/dev/null || error_exit "jq not found."

SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Function to destroy
function destroy {
  log "Preparing to destroy resources..."
  if $DRY_RUN; then
    log "[Dry Run] The following resources would be destroyed:"
    log "  - Service Principal: '$SP_DISPLAY_NAME'"
    log "  - Resource Group: '$RESOURCE_GROUP_NAME'"
    log "  - Storage Account: '$STORAGE_ACCOUNT_NAME'"
    log "  - Storage Container: '$CONTAINER_NAME'"
    log "  - terraform.tfvars file: '$TFVARS_FILE'"
    return
  fi

  log "Destroying resources..."

  APP_ID=$(az ad sp list --display-name "$SP_DISPLAY_NAME" --query "[0].appId" -o tsv)
  [[ -n "$APP_ID" ]] && az ad sp delete --id "$APP_ID" && log "Deleted SP" || warn "SP not found"

  az group delete --name "$RESOURCE_GROUP_NAME" --yes --no-wait || warn "Resource group deletion failed"

  [[ -f "$TFVARS_FILE" ]] && rm "$TFVARS_FILE"

  log "Environment destroyed."
  exit 0
}

# Handle destroy mode
if $RUN_DESTROY; then
  destroy
  exit 0
fi

# Enforce --provision to proceed
if ! $RUN_PROVISION; then
  usage
  exit 1
fi

log "Provisioning Terraform infrastructure (dry-run: $DRY_RUN)"

# Resource Group
if az group show --name "$RESOURCE_GROUP_NAME" &>/dev/null; then
  warn "Resource group '$RESOURCE_GROUP_NAME' already exists."
else
  $DRY_RUN && log "[Dry Run] Would create Resource Group: '$RESOURCE_GROUP_NAME' in '$LOCATION'" || \
    az group create --name "$RESOURCE_GROUP_NAME" --location "$LOCATION"
fi

# Service Principal
SP_EXISTS=$(az ad sp list --display-name "$SP_DISPLAY_NAME" --query "[0].appId" -o tsv)
if [[ -n "$SP_EXISTS" ]]; then
  warn "Service principal '$SP_DISPLAY_NAME' already exists."
  CLIENT_ID="$SP_EXISTS"
  log "Using existing service principal with ID: $CLIENT_ID"
  TENANT_ID=$(az account show --query tenantId -o tsv)

  if $DRY_RUN; then
    log "[Dry Run] Would generate a new secret for the existing service principal."
    CLIENT_SECRET="<dryrun-client-secret>"
  else
    log "Generating a new secret for the existing service principal..."
    CLIENT_SECRET=$(az ad sp credential reset \
      --id "$CLIENT_ID" \
      --years 1 -o tsv | awk '{print $2}') || error_exit "Failed to generate a new secret for the service principal."
    log "New secret generated successfully."
  fi
else
  if $DRY_RUN; then
    log "[Dry Run] Would create service principal:"
    log "  - Name: '$SP_DISPLAY_NAME'"
    log "  - Role: Contributor"
    log "  - Scope: $SP_SCOPE"
    CLIENT_ID="<dryrun-client-id>"
    CLIENT_SECRET="<dryrun-client-secret>"
    TENANT_ID="<dryrun-tenant-id>"
  else
    log "Creating service principal..."
    SP=$(az ad sp create-for-rbac \
      --name "$SP_DISPLAY_NAME" \
      --role Contributor \
      --scopes "$SP_SCOPE")
    CLIENT_ID=$(echo "$SP" | jq -r .appId)
    CLIENT_SECRET=$(echo "$SP" | jq -r .password)
    TENANT_ID=$(echo "$SP" | jq -r .tenant)
  fi
fi

# Check Storage Account Availability
log "Checking storage account availability for '$STORAGE_ACCOUNT_NAME'..."
AVAIL=$(az storage account check-name --name "$STORAGE_ACCOUNT_NAME" --query "nameAvailable" -o tsv)
if [[ "$AVAIL" != "true" ]]; then
  if $REUSE_STORAGE; then
    log "Reusing existing storage account '$STORAGE_ACCOUNT_NAME'."
  else
    error_exit "Storage account name '$STORAGE_ACCOUNT_NAME' is not available. Choose a different --postfix or use --reuse."
  fi
else
  log "Storage account name '$STORAGE_ACCOUNT_NAME' is available."
fi

# Create Storage Account
if $DRY_RUN; then
  log "[Dry Run] Would create storage account:"
  log "  - Name: $STORAGE_ACCOUNT_NAME"
  log "  - Resource Group: $RESOURCE_GROUP_NAME"
  log "  - Location: $LOCATION"
elif ! $REUSE_STORAGE || [[ "$AVAIL" == "true" ]]; then
  az storage account create \
    --name "$STORAGE_ACCOUNT_NAME" \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --location "$LOCATION" \
    --sku Standard_LRS || error_exit "Failed to create storage account."
fi

# Create Storage Container
if $DRY_RUN; then
  log "[Dry Run] Would check and create blob container:"
  log "  - Container: $CONTAINER_NAME"
  log "  - Account: $STORAGE_ACCOUNT_NAME"
else
  STORAGE_KEY=$(az storage account keys list \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --resource-group "$RESOURCE_GROUP_NAME" \
    --query "[0].value" -o tsv)

  CONTAINER_EXISTS=$(az storage container exists \
    --name "$CONTAINER_NAME" \
    --account-name "$STORAGE_ACCOUNT_NAME" \
    --account-key "$STORAGE_KEY" \
    --query "exists" -o tsv)

  if [[ "$CONTAINER_EXISTS" == "true" ]]; then
    warn "Container '$CONTAINER_NAME' already exists in storage account '$STORAGE_ACCOUNT_NAME'."
  else
    az storage container create \
      --name "$CONTAINER_NAME" \
      --account-name "$STORAGE_ACCOUNT_NAME" \
      --account-key "$STORAGE_KEY" || error_exit "Failed to create storage container."
    log "Storage container '$CONTAINER_NAME' created successfully."
  fi
fi

# Generate terraform.tfvars
log "Generating terraform.tfvars at $TFVARS_FILE"
cat <<EOF > "$TFVARS_FILE"
client_id            = "$CLIENT_ID"
client_secret        = "$CLIENT_SECRET"
tenant_id            = "$TENANT_ID"
subscription_id      = "$SUBSCRIPTION_ID"
resource_group_name  = "$RESOURCE_GROUP_NAME"
resource_group_location = "$LOCATION"
project_name         = "$APP_NAME"
subfix               = "$POSTFIX"
EOF

# Backend block
log "Terraform backend block (for your main.tf):"
cat <<EOF

terraform {
  backend "azurerm" {
    resource_group_name  = "$RESOURCE_GROUP_NAME"
    storage_account_name = "$STORAGE_ACCOUNT_NAME"
    container_name       = "$CONTAINER_NAME"
    key                  = "terraform.tfstate"
  }
}
EOF

if $DRY_RUN; then
  log "✅ Dry run complete — no resources were created."
else
  log "✅ Provisioning complete. You can now run 'terraform init'."
fi
