# Terraform Azure Resource Group Setup

This project contains Terraform configuration files for deploying an Azure resource group.

## Project Structure

- `main.tf`: Contains the configuration for creating the Azure resource group.
- `variables.tf`: Defines the variables used in the Terraform configuration.
- `outputs.tf`: Specifies the outputs of the Terraform configuration.
- `README.md`: Documentation for setting up and using the Terraform configuration.

## Getting Started

1. **Install Terraform**: Ensure you have Terraform installed on your machine. You can download it from [Terraform's official website](https://www.terraform.io/downloads.html).

2. **Configure Azure Provider**: Before running the Terraform scripts, you need to configure the Azure provider. This can be done by setting up your Azure credentials.

3. **Set Variables**: Update the `variables.tf` file with your desired resource group name and location.

4. **Initialize Terraform**: Run the following command to initialize the Terraform configuration:
   ```
   terraform init
   ```

5. **Plan the Deployment**: To see what resources will be created, run:
   ```
   terraform plan
   ```

6. **Apply the Configuration**: To create the resource group, execute:
   ```
   terraform apply
   ```

7. **Verify the Deployment**: Check your Azure portal to verify that the resource group has been created.

## Cleanup

To remove the resource group and all associated resources, run:
```
terraform destroy
```

## License

This project is licensed under the MIT License.