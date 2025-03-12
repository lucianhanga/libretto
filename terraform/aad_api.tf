# Register the application in Azure AD
resource "azuread_application" "buletine_api" {
  display_name = "Buletine API"

  identifier_uris = [
    "api://blondubuiletine"
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
      id = "d890bc22-7bf0-435a-bc11-98b4cd6baf7c"
      type = "User"
      enabled = true
    }    
  }
}

resource "azuread_application_pre_authorized" "azurecli" {
  application_id = azuread_application.buletine_api.id
  authorized_client_id = "04b07795-8ddb-461a-bbee-02f9e1bf7b46"

  permission_ids = [
    "d890bc22-7bf0-435a-bc11-98b4cd6baf7c"
  ]

  depends_on = [ azuread_application.buletine_api ]
}

resource "azuread_application_identifier_uri" "buletine_api_uri" {
  application_id = azuread_application.buletine_api.id
  identifier_uri = "api://${var.project_name}"

  depends_on = [ azuread_application.buletine_api ]
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

# output the URI
output "buletine_api_uri" {
  value = azuread_application_identifier_uri.buletine_api_uri.identifier_uri
}