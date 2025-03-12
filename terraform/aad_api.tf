# Register the application in Azure AD
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

#  this is required only if the function calls its own API
# 
# resource "azuread_application_api_access" "buletine_api_api" {
#   application_id = azuread_application.buletine_api.id
#   api_client_id = azuread_application.buletine_api.client_id

#   scope_ids = [
#     "0040f80f-bb46-4ca6-9b02-4bd92b4a974d"
#   ]
  
#   depends_on = [ azuread_application.buletine_api ]
# }

# Create a service principal for the application
resource "azuread_service_principal" "buletine_api_sp" {
  client_id = azuread_application.buletine_api.client_id

  depends_on = [ azuread_application.buletine_api ]
}

# Create a client secret for the application
resource "azuread_application_password" "buletine_api_secret" {
  application_id = azuread_application.buletine_api.id
  display_name          = "Buletine API Secret"
  end_date              = "2025-10-10T00:00:00Z" # 1 year from now

  depends_on = [ azuread_application.buletine_api ]
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