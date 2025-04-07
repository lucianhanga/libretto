# Register the application in Azure AD
resource "azuread_application" "libretto_api" {
  display_name = "Libretto API"

  identifier_uris = [
    "api://${var.project_name}"
  ]

  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000" # Microsoft Graph API

    resource_access {
      id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"  # User.Read (Delegated)
      type = "Scope"
    }
  }

  api {
    oauth2_permission_scope {
      admin_consent_description  = "Allows the app to call the exposed API"
      admin_consent_display_name = "Call the exposed API"
      user_consent_description   = "Call the exposed API"
      user_consent_display_name  = "API Calls"
      value                      = "user_impersonation"
      id = "d890bc33-7ba0-435a-bca1-98b4cd6baf8c"
      type = "User"
      enabled = true
    }    
  }
}

resource "azuread_application_pre_authorized" "azurecli" {
  application_id = azuread_application.libretto_api.id
  authorized_client_id = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"

  permission_ids = [
    "d890bc33-7ba0-435a-bca1-98b4cd6baf8c"
  ]

  depends_on = [ azuread_application.libretto_api ]
}
#  this is required only if the function calls its own API
# 
# resource "azuread_application_api_access" "libretto_api_api" {
#   application_id = azuread_application.libretto_api.id
#   api_client_id = azuread_application.libretto_api.client_id

#   scope_ids = [
#     "0040f80f-bb46-4ca6-9b02-4bd92b4a974d"
#   ]
  
#   depends_on = [ azuread_application.libretto_api ]
# }

# Create a service principal for the application
resource "azuread_service_principal" "libretto_api_sp" {
  client_id = azuread_application.libretto_api.client_id

  depends_on = [ azuread_application.libretto_api ]
}

# Create a client secret for the application
resource "azuread_application_password" "libretto_api_secret" {
  application_id = azuread_application.libretto_api.id
  display_name          = "libretto API Secret"
  end_date              = "2025-10-10T00:00:00Z" # 1 year from now

  depends_on = [ azuread_application.libretto_api ]
}

# Output the client ID and secret
output "libretto_api_client_id" {
  value = azuread_application.libretto_api.client_id
}

output "libretto_api_client_secret" {
  value = azuread_application_password.libretto_api_secret.value
  sensitive = true
}

output "libretto_api_tenant_id" {
  value = data.azurerm_client_config.current.tenant_id
}

# output the URI
output "libretto_api_uri" {
  value = "api://${var.project_name}"
}