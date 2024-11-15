from pydub import AudioSegment
from dotenv import load_dotenv
from tqdm import tqdm
import librosa
import numpy as np

import os
import math
import concurrent.futures

import app.logger as log

load_dotenv(dotenv_path="../.env")
logger = log.get_logger(__name__, os.getenv("LOG_LEVEL", 'DEBUG'))


def triangle_wave(x, amplitude=1.0):
    return max(-1.0, min(1.0, amplitude * (2 * abs((x % 1) - 0.5) * 2 - 1)))

def process_segment(segment, index, total_chunks, panning_frequency, amplitude):
    logger.info("Process Segment")
    # Apply triangle wave to achieve panning effect with adjusted amplitude
    pan_value = triangle_wave(index * panning_frequency / total_chunks, amplitude)
    panned = segment.pan(pan_value)
    return panned, index

def concatenate_segments_chunk(segments_chunk):
    logger.info("Concatenate Segments chunk")
    return sum((segment for _, segment in segments_chunk), AudioSegment.empty())

def concatenate_segments(processed_segments, chunk_size=100, pbar=None):
    logger.info("Concatenate segments")
    chunks = [processed_segments[i:i+chunk_size] for i in range(0, len(processed_segments), chunk_size)]

    with concurrent.futures.ProcessPoolExecutor() as executor:
        results = []
        for result in executor.map(concatenate_segments_chunk, chunks):
            results.append(result)
            if pbar:
                pbar.update(chunk_size)

    return sum(results, AudioSegment.empty())

def create_8d_audio(input_file_path: str, output_file_path: str, panning_frequency:int = 8, amplitude: int =1.2):
    logger.info("Starting the 8D audio creation...")
    audio = AudioSegment.from_file(input_file_path)
    
    segment_size = 50  # Segment size in ms
    total_segments = len(audio) // segment_size

    with tqdm(total=total_segments * 2, desc="Overall Progress", unit="segments") as pbar:
        processed_segments = []
        
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = []
            logger.info("Calculating panning")
            for i in range(0, len(audio), segment_size):
                segment = audio[i:i+segment_size]
                futures.append(executor.submit(process_segment, segment, i // segment_size, total_segments, panning_frequency, amplitude))

            logger.info("Collecting the segments")
            for future in concurrent.futures.as_completed(futures):
                result, index = future.result()
                processed_segments.append((index, result))
                pbar.update(1)

        logger.info("Sort the processed segments by their original index")
        processed_segments.sort(key=lambda x: x[0])

        logger.info("Concatenate all processed segments in order")
        output = concatenate_segments(processed_segments, pbar=pbar)

    logger.info("Exporting song")
    output.export(output_file_path, format="mp3")

def dynamic_pan(segment, pan_value):
    """Applies smooth panning to a segment based on the pan_value (-1 for left, 1 for right)."""
    # Ensure pan value is within a safe range [-0.9, 0.9] to avoid muting one side completely
    adjusted_pan_value = max(min(pan_value, 0.9), -0.9)
    return segment.pan(adjusted_pan_value)

def smooth_pan_transition(onset_strength, max_energy, chunk_idx, total_chunks):
    """Generates a smoothed panning value based on the energy and chunk position."""
    # Normalize the energy to control the panning speed
    pan_speed_factor = 1 + (onset_strength / max_energy)

    # Use a smoothed sine wave for the panning to ensure a gradual change
    pan_value = math.sin(2 * math.pi * (chunk_idx / total_chunks) * pan_speed_factor)

    # Return the pan value in the range [-0.9, 0.9] to prevent extreme values that could mute one side
    return pan_value

def create_dynamic_8d_audio(input_file_path: str, output_file_path: str):
    # Load the audio using librosa (for analysis) and pydub (for manipulation)
    y, sr = librosa.load(input_file_path, sr=None)

    # Get the onset strength envelope
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    max_onset_strength = np.max(onset_env)

    # Load the full audio with pydub for manipulation
    audio = AudioSegment.from_file(input_file_path)
    output = AudioSegment.empty()

    # Define the chunk size in milliseconds
    segment_size_ms = 20  # 50ms segments
    total_chunks = len(audio) // segment_size_ms

    # Process each chunk and apply smooth panning based on onset strength
    for chunk_idx in tqdm(range(total_chunks), desc="Processing Audio"):
        segment_start_ms = chunk_idx * segment_size_ms
        segment_end_ms = segment_start_ms + segment_size_ms

        # Extract the current 50ms segment from the audio using Pydub
        segment = audio[segment_start_ms:segment_end_ms]

        # Map onset strength to the correct time chunk
        onset_strength_idx = int((chunk_idx / total_chunks) * len(onset_env))
        onset_strength = onset_env[onset_strength_idx]

        # Calculate the smoothed pan value
        pan_value = smooth_pan_transition(onset_strength, max_onset_strength, chunk_idx, total_chunks)

        # Apply panning to the current segment
        panned_segment = dynamic_pan(segment, pan_value)

        # Append the panned segment to the final output
        output += panned_segment

    # Handle any remaining milliseconds in the audio
    if len(audio) % segment_size_ms != 0:
        segment = audio[total_chunks * segment_size_ms:]
        output += dynamic_pan(segment, pan_value)

    # Export the final 8D audio output
    output.export(output_file_path, format="mp3")
    print(f"8D audio exported to {output_file_path}")


if __name__ == "__main__":
    input_file = "test/testing.mp3"
    output_file = "app/out/output2.mp3"

    print(f"Processing {input_file} to {output_file}...")
    create_8d_audio(input_file, output_file)
    print("Processing complete.")
