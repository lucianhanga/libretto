#!/usr/bin/env python3
import json
import subprocess

def get_terraform_output(output_name):
    """Fetch raw Terraform output value."""
    try:
        print(f"Fetching Terraform output for {output_name}...")
        result = subprocess.run(
            ["terraform", "-chdir=../terraform", "output", "-raw", output_name],
            capture_output=True,
            text=True,
            check=True
        )
        result.check_returncode()
        output_value = result.stdout.strip()
        print(f"Successfully fetched Terraform output for {output_name}: {output_value}")
        return output_value
    except subprocess.CalledProcessError as e:
        print(f"⚠ Warning: Unable to fetch Terraform output for {output_name}. Error: {e}")
        return ""

# Generate .env.development and .env.production files
env_development = f"""
REACT_APP_CLIENT_ID={get_terraform_output('buletine_app_client_id')}
REACT_APP_TENANT_ID={get_terraform_output('buletine_app_tenant_id')}
REACT_APP_REDIRECT_URI=http://localhost:3000
REACT_APP_API_BASE_URL=http://localhost:7071/api
"""

env_production = f"""
REACT_APP_CLIENT_ID={get_terraform_output('buletine_app_client_id')}
REACT_APP_TENANT_ID={get_terraform_output('buletine_app_tenant_id')}
REACT_APP_REDIRECT_URI={get_terraform_output('storage_account_primary_web_endpoint')}
REACT_APP_API_BASE_URL=https://{get_terraform_output('api_base_url')}/api/
"""

# Write to .env.development
with open("../buletine-app/.env.development", "w") as f:
    f.write(env_development.strip())

# Write to .env.production
with open("../buletine-app/.env.production", "w") as f:
    f.write(env_production.strip())

print("✅ .env.development and .env.production files have been successfully generated!")