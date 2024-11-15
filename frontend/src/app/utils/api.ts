// src/utils/api.ts
import axios, { AxiosProgressEvent } from 'axios';

export const uploadAudio = async (
    file: File, 
    panningFrequency: number, 
    amplitude: number
  ) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('panning_frequency', panningFrequency.toString());
  formData.append('amplitude', amplitude.toString());

  const response = await axios.post('http://localhost:8080/generate_audio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob', // Ensure response is treated as a file (binary)
  });

  return response;
};
