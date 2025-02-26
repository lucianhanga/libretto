import azure.functions as func
from UploadImage import upImg
from BlobTriggerFunction import blTrig
from PullResults import pullRes
app = func.FunctionApp()
app.register_blueprint(upImg)
app.register_blueprint(blTrig)
app.register_blueprint(pullRes)


