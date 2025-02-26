import azure.functions as func
from azure.identity import DefaultAzureCredential
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from azure.data.tables import TableServiceClient
import datetime
import json
import logging
from datetime import datetime, date
import os
import re

blTrig = func.Blueprint()

# Custom function to handle non-serializable types
def json_serializer(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()  # Convert date/time to ISO 8601 format
    raise TypeError(f"Type {type(obj)} not serializable")


@blTrig.blob_trigger(arg_name="myblob", path="upload/{name}", connection="AzureWebJobsStorage")
def ImageAvailable(myblob: func.InputStream):
    logging.info(f"Blob trigger function processed blob \n"
                 f"Name: {myblob.name}\n"
                 f"Blob Size: {myblob.length} bytes")
    
    # get the blob url
    blob_url = myblob.uri
    logging.info(f"Blob URL: {blob_url}")
    # get the blob name
    blob_name = myblob.name
    logging.info(f"Blob Name: {blob_name}")
    
    # get the document intelligence endpoint and key from environment variables
    dc_endpoint = os.getenv("DOCUMENT_INTELLIGENCE_ENDPOINT")
    dc_key = os.getenv("DOCUMENT_INTELLIGENCE_KEY")

    if not dc_endpoint or not dc_key:
        logging.error("Document intelligence endpoint or key is not set in environment variables.")
        return

    logging.info(f"Document Intelligence Endpoint: {dc_endpoint}")
    logging.info(f"Document Intelligence Key: {dc_key}")
    
    try:
        # create the document analysis client
        document_analysis_client = DocumentAnalysisClient(endpoint=dc_endpoint, credential=AzureKeyCredential(dc_key))
        poller = document_analysis_client.begin_analyze_document_from_url("prebuilt-idDocument", blob_url)
        id_documents = poller.result()
    
        # get the first one
        id_document = id_documents.documents[0]
        logging.info(f"ID Document: {id_document}")
        # convert to dictionary
        id_document_dict = id_document.to_dict()
        # convert to json
        id_document_json = json.dumps(id_document_dict, default=json_serializer, indent=4)
                    
        # from the blob url, get the storage account name
        storage_account_name = blob_url.split(".")[0].split("//")[1]
        logging.info(f"Storage Account Name: {storage_account_name}")
        # get the table service client
        account_url = f"https://{storage_account_name}.table.core.windows.net"
        logging.info(f"Account URL: {account_url}")
        # create the table service client
        table_service_client = TableServiceClient(endpoint=account_url, credential=DefaultAzureCredential())
        # get the table client
        table_client = table_service_client.get_table_client("results")
        # create the entity
        # prepare the RowKey which should be unique and not contain special characters
        # strip the blob name for special characters
        logging.info(f"Blob Name: {blob_name}")
        match = re.search(r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', blob_name)
        row_key = match.group(1) if match else None
        logging.info(f"Row Key: {row_key}")
        entity = {
            "PartitionKey": "results",
            "RowKey": row_key,
            "Document": id_document_json
        }
        # insert the entity
        table_client.upsert_entity(entity)
        # log the result
        logging.info(f"Result saved in the table under id {blob_name}")
        
        # remove the processed image blob from the storage account
        # suppose that the function has RBAC contributor role on the storage account
        blob_client = BlobClient.from_blob_url(blob_url, credential=DefaultAzureCredential())
        blob_client.delete_blob()
                        
    except Exception as e:
        logging.error(f"Error: {e}")
        raise e
    return
