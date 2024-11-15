# test_main.py
import os
import re
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_home_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}

def test_generate_audio_success(monkeypatch):
    # Prepare a mock function to bypass actual audio processing
    def mock_create_8d_audio(input_file_path, output_file_path, panning_frequency, amplitude):
        # Create a dummy output file to simulate success
        with open(output_file_path, "w") as f:
            f.write("dummy audio content")
    
    # Patch `create_8d_audio` function
    monkeypatch.setattr("app.main.create_8d_audio", mock_create_8d_audio)
    
    # Simulate uploading a file
    with open("test.mp3", "wb") as f:
        f.write(b"dummy content")
    
    with open("test.mp3", "rb") as test_file:
        response = client.post(
            "/generate_audio",
            files={"file": test_file},
            data={"panning_frequency": 8, "amplitude": 2}
        )

    assert response.status_code == 200
    assert response.headers["content-disposition"].startswith("attachment; filename=")

    # Extract filename from Content-Disposition header
    content_disposition = response.headers["content-disposition"]
    filename_match = re.search(r'filename="(.+)"', content_disposition)
    if filename_match:
        filename = filename_match.group(1)
        file_path = os.path.join("temp", filename)
        
        # Attempt to delete the generated file if it exists
        if os.path.exists(file_path):
            os.remove(file_path)
        else:
            print(f"File not found at: {file_path}")

    # Clean up the test input file
    os.remove("test.mp3")

def test_generate_audio_invalid_file():
    response = client.post(
        "/generate_audio",
        files={"file": ("test.txt", b"Not an audio file")},
        data={"panning_frequency": 8, "amplitude": 2}
    )
    assert response.status_code == 500
    assert "Error processing file" in response.json()["detail"]
