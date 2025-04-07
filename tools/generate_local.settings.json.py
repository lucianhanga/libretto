#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path

# Paths relative to the project main folder
TERRAFORM_DIR = "./terraform"
LOCAL_SETTINGS_PATH = "./libretto-api/local.settings.json"

def get_terraform_output(output_name):
    """Fetch raw Terraform output value."""
    try:
        print(f"Fetching Terraform output for {output_name}...")
        result = subprocess.run(
            ["terraform", f"-chdir={TERRAFORM_DIR}", "output", "-raw", output_name],
            capture_output=True,
            text=True,
            check=True
        )
        result.check_returncode()
        output_value = result.stdout.strip()
        print(f"Successfully fetched Terraform output for {output_name}: {output_value}")
        return output_value
    except subprocess.CalledProcessError as e:
        print(f"\033[1;31m❌ Error: Unable to fetch Terraform output for {output_name}. Error: {e}\033[0m")
        print("\033[1;31mEnsure that the Terraform state is initialized by running 'terraform init' in the ./terraform folder.\033[0m")
        return ""

# Generate local.settings.json directly
settings = {
    "IsEncrypted": False,
    "Values": {
        "AzureWebJobsStorage": f"DefaultEndpointsProtocol=https;AccountName={get_terraform_output('storage_account_name')};AccountKey={get_terraform_output('storage_account_key')};EndpointSuffix=core.windows.net",
        "AzureWebJobs.ImageAvailable.Disabled": "true",
        "FUNCTIONS_WORKER_RUNTIME": "python",
        "STORAGE_ACCOUNT_NAME": get_terraform_output("storage_account_name"),
        "DOCUMENT_INTELLIGENCE_ENDPOINT": get_terraform_output("document_intelligence_endpoint"),
        "DOCUMENT_INTELLIGENCE_KEY": get_terraform_output("document_intelligence_key"),
        "REQUIRED_GROUP_ID": "c1b83efb-4637-4ca0-9a7e-13e069be8ef5",
        "LIBRETTO_API_CLIENT_ID": get_terraform_output("libretto_api_client_id"),
        "LIBRETTO_API_CLIENT_SECRET": get_terraform_output("libretto_api_client_secret"),
        "LIBRETTO_API_TENANT_ID": get_terraform_output("libretto_api_tenant_id"),
        "STORAGE_ACCOUNT_PRIMARY_WEB_ENDPOINT": get_terraform_output("storage_account_primary_web_endpoint")
    }
}

# Write to local.settings.json
local_settings_path = Path(LOCAL_SETTINGS_PATH)
local_settings_path.parent.mkdir(parents=True, exist_ok=True)  # Ensure the directory exists

with open(local_settings_path, "w") as f:
    json.dump(settings, f, indent=4)

print(f"✅ local.settings.json file has been successfully generated at {LOCAL_SETTINGS_PATH}!")
