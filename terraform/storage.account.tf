#
# generate a random suffix for the storage account
#
resource "random_id" "suffix" {
  byte_length = 4  # 8 characters in hex
}
locals {
  storage_account_name = "${var.project_name}${random_id.suffix.hex}"
}
output "storage_account_name" {
  value = local.storage_account_name
}

#
# create the storage account for the project
# 
resource "azurerm_storage_account" "st" {

  depends_on = [ azurerm_resource_group.rg ]

  name                     = local.storage_account_name
  resource_group_name      = var.resource_group_name
  location                 = var.resource_group_location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  static_website {
    index_document = "index.html"
    error_404_document = "index.html"
  }

#   blob_properties {
#     cors_rule {
#       allowed_headers = ["*"]
#       allowed_methods = ["GET", "POST", "PUT", "DELETE"]
#       allowed_origins = ["*"]
#       exposed_headers = ["*"]
#       max_age_in_seconds = 3600
#     }
#   }
}

#
# create the container where the applications will upload files
# 
resource "azurerm_storage_container" "container" {

  depends_on = [ azurerm_storage_account.st ]

  name                  = "upload"
  storage_account_name  = azurerm_storage_account.st.name
  container_access_type = "private"
}

# 
# create a table to store the result of the processing
# 
resource "azurerm_storage_table" "table" {

  depends_on = [ azurerm_storage_account.st ]

  name                 = "results"
  storage_account_name = azurerm_storage_account.st.name
}
