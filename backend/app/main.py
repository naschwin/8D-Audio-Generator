from app.utils import create_8d_audio
import app.logger as log
from app.config import settings

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import uuid
import os

load_dotenv(dotenv_path="../.env")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",  # OpenAPI path
    docs_url=None if settings.DISABLE_DOCS else "/docs",  # Disable docs in prod
    redoc_url=None if settings.DISABLE_DOCS else "/redoc"  # Disable redoc in prod
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = log.get_logger(__name__, os.getenv("LOG_LEVEL", 'DEBUG'))

@app.get("/")
def home():
    return {"Hello":"World"}

@app.post("/generate_audio")
async def generate_audio(panning_frequency: int = 8, amplitude: int = 2, file: UploadFile = File((...)), background_tasks: BackgroundTasks = None):
    try:
        logger.info("Process the uploaded file")

        # Ensure the temp directory exists
        os.makedirs("temp", exist_ok=True)

        input_file_path = f"temp/{uuid.uuid4()}_{file.filename}"
        output_file_path = f"temp/{uuid.uuid4()}_8d_{file.filename}"

        logger.info("Saving the uploaded file")
        with open(input_file_path, "wb") as buffer:
            buffer.write(await file.read())

        logger.info("Generate the 8D audio")
        create_8d_audio(input_file_path, output_file_path, panning_frequency, amplitude)

        # Add background task to delete files after sending the response
        background_tasks.add_task(os.remove, input_file_path)
        background_tasks.add_task(os.remove, output_file_path)

        # Return the processed file
        return FileResponse(output_file_path, filename=f"8d_{file.filename}")

    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
