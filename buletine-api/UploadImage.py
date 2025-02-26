import logging
import azure.functions as func
import base64
import os
import json
import uuid
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

upImg = func.Blueprint()

# Define the storage account name and container name from environment variables
STORAGE_ACCOUNT_NAME = os.getenv("STORAGE_ACCOUNT_NAME")
CONTAINER_NAME = "upload"

@upImg.route(route="UploadImage", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
def UploadImage(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            body=json.dumps({"error": "Invalid JSON"}),
            status_code=400,
            mimetype="application/json"
        )

    image_data = req_body.get('image')
    file_extension = req_body.get('extension')
    if not image_data or not file_extension:
        return func.HttpResponse(
            body=json.dumps({"error": "Please pass an image and its extension in the request body"}),
            status_code=400,
            mimetype="application/json"
        )

    try:
        image_bytes = base64.b64decode(image_data)
        image_id = str(uuid.uuid4())
        blob_name = f"{image_id}.{file_extension}"
        
        # Use DefaultAzureCredential to authenticate with Managed Identity
        credential = DefaultAzureCredential()
        
        # Create the BlobServiceClient object
        blob_service_client = BlobServiceClient(
            account_url=f"https://{STORAGE_ACCOUNT_NAME}.blob.core.windows.net",
            credential=credential
        )
        
        # Get a reference to the container
        container_client = blob_service_client.get_container_client(CONTAINER_NAME)
        
        # Upload the image to the container
        blob_client = container_client.get_blob_client(blob_name)
        blob_client.upload_blob(image_bytes, overwrite=True)
        
        return func.HttpResponse(
            body=json.dumps({"id": image_id}),
            status_code=200,
            mimetype="application/json"
        )
    except Exception as e:
        logging.error(f"Error saving image: {e}")
        return func.HttpResponse(
            body=json.dumps({"error": "Error saving image"}),
            status_code=500,
            mimetype="application/json"
        )
