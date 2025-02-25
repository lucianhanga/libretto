import logging 

import azure.functions as func 

upImg = func.Blueprint() 

@upImg.route(route="UploadImage", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS) 
def UploadImage(req: func.HttpRequest) -> func.HttpResponse: 
    logging.info('Python HTTP trigger function processed a request.') 
    return func.HttpResponse("UploadImage route called successfully.")
