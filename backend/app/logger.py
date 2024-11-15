import logging
import os

# Set up a logger
def get_logger(logger_name: str, log_level: str) -> logging.Logger:
    # Create a custom logger
    logger = logging.getLogger(logger_name)

    # Set log level
    logger.setLevel(getattr(logging, log_level, logging.INFO))

    # Check if the logger already has handlers, avoid adding multiple handlers
    if not logger.hasHandlers():
        # Create handlers
        file_handler = logging.FileHandler('app.log')
        console_handler = logging.StreamHandler()

        # Set level for handlers (could be more granular)
        file_handler.setLevel(logging.DEBUG)
        console_handler.setLevel(logging.INFO)

        # Create formatters and add to handlers
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        # Add handlers to the logger
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

    return logger
