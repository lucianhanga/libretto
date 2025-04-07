terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.1.0"
    }
  }

    backend "azurerm" {
      resource_group_name  = "libretto-rg"
      storage_account_name = "terraform0abc"
      container_name       = "tfstate"
      key                  = "terraform.tfstate"
    }
  }

provider "azurerm" {
  features {} 
  subscription_id = var.subscription_id
}

data "azurerm_client_config" "current" {}
