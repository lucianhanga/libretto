locals {
  # the name of azure cognitive service
  cognitive_account_name = "cg${var.project_name}"
}
 
#
# create the cognitive service
#
#
resource "azurerm_cognitive_account" "document_intelligence" {
  name                = local.cognitive_account_name
  location            = var.resource_group_location
  resource_group_name = var.resource_group_name
  kind                = "FormRecognizer"  # Specifies the kind of Cognitive Service
  sku_name            = "S0"              # Specifies the SKU of the Cognitive Service

  identity {
    type = "SystemAssigned"
  }
}

/*
az resource show \
  --ids /subscriptions/44feaee5-c984-4c09-a02f-46c7d78ad294/resourceGroups/rg-docbuletine7/providers/Microsoft.CognitiveServices/accounts/cgdocbuletine7 \
  --query identity
*/

#
# assign to the document intelligence the RBAC role of "Storage Blob Data Contributor" to the storage account
# 
resource "azurerm_role_assignment" "document_intelligence_storage_account" {
  scope                = azurerm_storage_account.st.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_cognitive_account.document_intelligence.identity[0].principal_id

  depends_on = [ 
    azurerm_cognitive_account.document_intelligence
  ]
}


# get the endpoint and key of the cognitive service
output "document_intelligence_endpoint" {
  description = "The endpoint for the Document Intelligence service."
  value = azurerm_cognitive_account.document_intelligence.endpoint
}

# get the key of the cognitive service
output "document_intelligence_key" {
  description = "The primary key for the Document Intelligence service."
  value = azurerm_cognitive_account.document_intelligence.primary_access_key
  sensitive = true
}
