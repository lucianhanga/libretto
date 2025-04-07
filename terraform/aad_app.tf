# Register the application in Azure AD for the React app
resource "azuread_application" "libretto_app" {
  display_name = "Libretto App"

  single_page_application {
    redirect_uris = [
      "http://localhost:3000/",
      # the storage account primary web endpoint
      "${azurerm_storage_account.st.primary_web_endpoint}",
    ]
  }

  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000" # Microsoft Graph API

    resource_access {
      id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"  # User.Read (Delegated)
      type = "Scope"
    }
  }

  required_resource_access {
    resource_app_id = azuread_application.libretto_api.client_id
    resource_access {
      id   = "d890bc22-7bf0-435a-bc11-98b4cd6baf7c"
      type = "Scope"
    }
  
  }

  depends_on = [ azurerm_storage_account.st ]
}

# Create a service principal for the application
resource "azuread_service_principal" "libretto_app_sp" {
  client_id = azuread_application.libretto_app.client_id
  depends_on = [ azuread_application.libretto_app ]
}

# Output the client ID and tenant ID
output "libretto_app_client_id" {
  value = azuread_application.libretto_app.client_id
}

output "libretto_app_tenant_id" {
  value = data.azurerm_client_config.current.tenant_id
}