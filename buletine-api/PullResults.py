import logging
import azure.functions as func
import os
from azure.identity import DefaultAzureCredential
import json

pullRes = func.Blueprint()

# Define the storage account name and container name from environment variables
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

    # Return an empty JSON response for now
    return func.HttpResponse(
        body=json.dumps({"guid": guid}),
        status_code=200,
        mimetype="application/json"
    )


