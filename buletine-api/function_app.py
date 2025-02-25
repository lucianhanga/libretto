import azure.functions as func
from UploadImage import upImg
from BlobTriggerFunction import blTrig
app = func.FunctionApp()
app.register_blueprint(upImg)
app.register_blueprint(blTrig)

