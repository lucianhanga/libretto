# Register the application in Azure AD for the React app
resource "azuread_application" "buletine_app" {
  display_name = "Buletine App"

  single_page_application {
    redirect_uris = [
      "http://localhost:3000/",
    ]
  }

  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000" # Microsoft Graph API

    resource_access {
      id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"  # User.Read (Delegated)
      type = "Scope"
    }
  }
}

# Create a service principal for the application
resource "azuread_service_principal" "buletine_app_sp" {
  client_id = azuread_application.buletine_app.client_id
  depends_on = [ azuread_application.buletine_app ]
}

# Output the client ID and tenant ID
output "buletine_app_client_id" {
  value = azuread_application.buletine_app.client_id
}

output "buletine_app_tenant_id" {
  value = data.azurerm_client_config.current.tenant_id
}