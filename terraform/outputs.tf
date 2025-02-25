output "storage_account_primary_web_endpoint" {
  description = "The primary endpoint for the static website"
  value       = azurerm_storage_account.st.primary_web_endpoint
}
