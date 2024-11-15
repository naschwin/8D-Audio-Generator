from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "8D Music Generator"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "This is the swagger docs for 8d music generator's api"
    API_V1_STR: str = "/api/v1"

    # Swagger Docs control
    DISABLE_DOCS: bool = False  # Disable docs in production


settings = Settings()
