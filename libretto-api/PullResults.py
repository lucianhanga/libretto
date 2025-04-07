import logging
import azure.functions as func
import os
from azure.identity import DefaultAzureCredential
from azure.data.tables import TableServiceClient
import json

pullRes = func.Blueprint()

# Define the storage account name and table name from environment variables
STORAGE_ACCOUNT_NAME = os.getenv("STORAGE_ACCOUNT_NAME")
TABLE_NAME = "results"

@pullRes.route(route="PullResults", methods=["GET"], auth_level=func.AuthLevel.ANONYMOUS)
def PullResults(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Pulling results from the table storage.')

    # Get the GUID from the query parameters
    guid = req.params.get('guid')
    if not guid:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            guid = req_body.get('guid')

    if not guid:
        return func.HttpResponse(
            body=json.dumps({"error": "Please pass a GUID in the query string or in the request body"}),
            status_code=400,
            mimetype="application/json"
        )

    logging.info(f"GUID: {guid}")

    try:
        # Use DefaultAzureCredential to authenticate with Managed Identity
        credential = DefaultAzureCredential()
        
        # Create the TableServiceClient object
        account_url = f"https://{STORAGE_ACCOUNT_NAME}.table.core.windows.net"
        table_service_client = TableServiceClient(endpoint=account_url, credential=credential)
        
        # Get the table client
        table_client = table_service_client.get_table_client(TABLE_NAME)
        
        # Retrieve the entity from the table
        entity = table_client.get_entity(partition_key="results", row_key=guid)
        
        # Convert the entity to JSON
        entity_json = json.dumps(entity, default=str)
        
        try:
            # Delete the entity from the table
            table_client.delete_entity(partition_key="results", row_key=guid)
        except Exception as delete_error:
            logging.error(f"Error deleting entity: {delete_error}")
        
        return func.HttpResponse(
            body=entity_json,
            status_code=200,
            mimetype="application/json"
        )
    except Exception as e:
        logging.error(f"Error retrieving entity: {e}")
        return func.HttpResponse(
            body=json.dumps({"error": "Error retrieving entity"}),
            status_code=500,
            mimetype="application/json"
        )


