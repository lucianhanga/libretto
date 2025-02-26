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

  app_settings = {
  }

  identity {
    type = "SystemAssigned"
  }
  depends_on = [ 
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
