import azure.functions as func
import datetime
import json
import logging
from UploadImage import upImg

app = func.FunctionApp()
app.register_blueprint(upImg)

