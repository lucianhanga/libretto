import logging
import azure.functions as func

blTrig = func.Blueprint()

@blTrig.blob_trigger(arg_name="myblob", path="upload/{name}", connection="")
def ImageAvailable(myblob: func.InputStream):
    logging.info(f"Blob trigger function processed blob \n"
                 f"Name: {myblob.name}\n"
                 f"Blob Size: {myblob.length} bytes")
    
