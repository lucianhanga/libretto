output "resource_group_id" {
  value = azurerm_resource_group.rg.id
}

output "resource_group_name" {
  description = "The name of the resource group"
  value       = azurerm_resource_group.rg.name
}

output "storage_account_primary_web_endpoint" {
  description = "The primary endpoint for the static website"
  value       = azurerm_storage_account.st.primary_web_endpoint
}

output "resource_group_location" {
  description = "The location of the resource group"
  value       = azurerm_resource_group.rg.location
}