#
# Register the application in Azure AD
# 
resource "azuread_application" "buletine_api" {
  display_name = "Buletine API"

  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000" # Microsoft Graph API

    resource_access {
      id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"  # User.Read (Delegated)
      type = "Scope"
    }
  }

  api {
    oauth2_permission_scope {
      admin_consent_description  = "Allows the app to read the signed-in user's files."
      admin_consent_display_name = "Read user files"
      user_consent_description   = "Allows the app to read your files."
      user_consent_display_name  = "Read your files"
      value                      = "Files.Read"
      id = "0040f80f-bb46-4ca6-9b02-4bd92b4a974d"
      type = "User"
      enabled = true
    }
  }
}

resource "azuread_application_api_access" "buletine_api_api" {
  application_id = azuread_application.buletine_api.id
  api_client_id = azuread_application.buletine_api.client_id

  scope_ids = [
    "0040f80f-bb46-4ca6-9b02-4bd92b4a974d"
  ]
  
  depends_on = [ azuread_application.buletine_api ]
}

# # Step 2: Set the Application ID URI using the created application ID
# resource "azuread_application_identifier_uri" "buletine_api_uri" {
#   application_id  = azuread_application.buletine_api.id
#   identifier_uri  = "api://${azuread_application.buletine_api.client_id}"

#   depends_on = [ azuread_application.buletine_api ]
# }

#
# Create a service principal for the application
#
resource "azuread_service_principal" "buletine_api_sp" {
  client_id = azuread_application.buletine_api.client_id

  depends_on = [ azuread_application.buletine_api ]
}



#
# Create a client secret for the application
#
resource "azuread_application_password" "buletine_api_secret" {
  application_id = azuread_application.buletine_api.id
  display_name          = "Buletine API Secret"
  end_date              = "2025-10-10T00:00:00Z" # 1 year from now

  depends_on = [ azuread_application.buletine_api ]
}


# define the Azure Function App Service Plan

locals {
  func_service_plan_name = "asp-${var.project_name}"
}

resource "azurerm_service_plan" "function_service_plan" {
  name                = local.func_service_plan_name
  location            = var.resource_group_location
  resource_group_name = var.resource_group_name

  sku_name = "Y1"
  os_type  = "Linux"
}

# define the Azure Function App

locals {
  func_app_name = "api-${var.project_name}"
}

# create the api function app
resource "azurerm_linux_function_app" "api" {
  name                       = local.func_app_name
  location                   = var.resource_group_location
  resource_group_name        = var.resource_group_name
  service_plan_id            = azurerm_service_plan.function_service_plan.id
  storage_account_name       = azurerm_storage_account.st.name
  storage_account_access_key = azurerm_storage_account.st.primary_access_key
  functions_extension_version = "~4"

  site_config {
    application_stack {
      python_version = "3.10"
    }
  }

  auth_settings_v2 {
    auth_enabled = true
    require_authentication = true
    unauthenticated_action = "Return401"
    active_directory_v2 {
      client_id = azuread_application.buletine_api.client_id
      tenant_auth_endpoint = "https://login.microsoftonline.com/${data.azurerm_client_config.current.tenant_id}/v2.0"
    }
    login {
    }
  }

  identity {
    type = "SystemAssigned"
  }
  depends_on = [ 
    azuread_application.buletine_api,
    azurerm_service_plan.function_service_plan,
    azurerm_storage_account.st
  ]
}

#
# assign the identity of the function app to the storage account
#
resource "azurerm_role_assignment" "function_app_storage_account_blob_rights" {
  scope                = azurerm_storage_account.st.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_linux_function_app.api.identity[0].principal_id

  depends_on = [
    azurerm_storage_container.container,
    azurerm_linux_function_app.api
  ] 
} 

# 
# assign the identity of the function app to the storage account to deal with the table
# 
resource "azurerm_role_assignment" "function_app_storage_account_table_rights" {
  scope                = azurerm_storage_account.st.id
  role_definition_name = "Storage Table Data Contributor"
  principal_id         = azurerm_linux_function_app.api.identity[0].principal_id

  depends_on = [
    azurerm_storage_table.table,
    azurerm_linux_function_app.api
  ]
}

#
# assign the identity of the function app to the cognitive service
#
resource "azurerm_role_assignment" "function_app_cognitive_service_rights" {
  scope                = azurerm_cognitive_account.document_intelligence.id
  role_definition_name = "Cognitive Services Contributor"
  principal_id         = azurerm_linux_function_app.api.identity[0].principal_id

  depends_on = [
    azurerm_cognitive_account.document_intelligence,
    azurerm_linux_function_app.api
  ]
}



# Output the client ID and secret
output "buletine_api_client_id" {
  value = azuread_application.buletine_api.client_id
}

output "buletine_api_client_secret" {
  value = azuread_application_password.buletine_api_secret.value
  sensitive = true
}

output "buletine_api_tenant_id" {
  value = data.azurerm_client_config.current.tenant_id
}

