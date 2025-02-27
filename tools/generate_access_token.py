#!/usr/bin/env python3
import json
import subprocess
import requests

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
        print(f"✅ Successfully fetched Terraform output for {output_name}")
        return output_value
    except subprocess.CalledProcessError as e:
        print(f"⚠ Warning: Unable to fetch Terraform output for {output_name}. Error: {e}")
        return ""

def generate_access_token():
    """Fetch an access token using Azure AD OAuth2."""
    tenant_id = get_terraform_output("buletine_api_tenant_id")
    client_id = get_terraform_output("buletine_api_client_id")
    client_secret = get_terraform_output("buletine_api_client_secret")
    scope = f"api://{client_id}/.default"

    url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": scope,
        "grant_type": "client_credentials"
    }

    curl_command = f"curl -X POST {url} -H 'Content-Type: application/x-www-form-urlencoded' -d 'client_id={client_id}&client_secret={client_secret}&scope={scope}&grant_type=client_credentials'"
    print(f"🔄 Requesting access token with the following curl command:\n{curl_command}")

    response = requests.post(url, headers=headers, data=data)

    if response.status_code == 200:
        access_token = response.json().get("access_token")
        print("✅ Successfully obtained access token!")
        return access_token
    else:
        print(f"❌ Failed to retrieve access token. Response: {response.text}")
        return None

if __name__ == "__main__":
    token = generate_access_token()
    if token:
        print(f"\n🔑 Access Token:\n{token}")
