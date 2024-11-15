import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

# Get environment variables
debug_mode = os.getenv("DEBUG", "True").lower() == "true"
reload_mode = os.getenv("RELOAD", "False").lower() == "true"
log_level = os.getenv("LOG_LEVEL", "INFO").upper()

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="localhost",
        port=8080,
        reload=reload_mode,  # Hot-reloading for development
        workers=1 if debug_mode else 4,  # Use more workers in production
    )

