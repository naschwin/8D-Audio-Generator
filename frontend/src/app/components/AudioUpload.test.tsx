import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AudioUpload from './AudioUpload';
import { uploadAudio } from '@/app/utils/api';
import axios, { AxiosHeaders } from 'axios';
import '@testing-library/jest-dom';

jest.mock('@/app/utils/api');
const mockUploadAudio = uploadAudio as jest.MockedFunction<typeof uploadAudio>;

describe('AudioUpload Component', () => {
  beforeEach(() => {
    mockUploadAudio.mockClear();
  });

  test('renders file upload input, sliders, and submit button', () => {
    render(<AudioUpload />);

    expect(screen.getByLabelText(/click to upload or drag and drop/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/panning frequency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amplitude/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  test('allows user to select a file', () => {
    render(<AudioUpload />);

    const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mpeg' });
    const uploadInput = screen.getByLabelText(/click to upload or drag and drop/i) as HTMLInputElement;

    fireEvent.change(uploadInput, { target: { files: [file] } });

    expect(uploadInput.files?.[0]).toStrictEqual(file);
    expect(uploadInput.files).toHaveLength(1);
  });

  test('updates slider values on change', () => {
    render(<AudioUpload />);

    const panningSlider = screen.getByLabelText(/panning frequency/i);
    const amplitudeSlider = screen.getByLabelText(/amplitude/i);

    fireEvent.change(panningSlider, { target: { value: '10' } });
    fireEvent.change(amplitudeSlider, { target: { value: '5' } });

    expect(panningSlider).toHaveValue('10');
    expect(amplitudeSlider).toHaveValue('5');
  });

  test('displays loading animation during form submission', async () => {
    render(<AudioUpload />);
    mockUploadAudio.mockResolvedValueOnce({ data: 'test-data',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
            headers: new AxiosHeaders(), 
            method: 'post',
            url: '/upload', 
          }, }
    ); // Mock API response

    const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mpeg' });
    const uploadInput = screen.getByLabelText(/click to upload or drag and drop/i);
    const submitButton = screen.getByRole('button', { name: /upload/i });

    fireEvent.change(uploadInput, { target: { files: [file] } });
    fireEvent.click(submitButton);

    // Assert the loading spinner is shown
    expect(screen.getAllByRole('status')).toHaveLength(3); // Three animated divs

    // Wait for loading spinner to disappear
    await waitFor(() => expect(screen.queryAllByRole('status')).toHaveLength(0));
  });

  test('calls API and shows download modal on successful upload', async () => {
    mockUploadAudio.mockResolvedValueOnce({ data: 'test-data',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
            headers: new AxiosHeaders(), 
            method: 'post',
            url: '/upload', 
          }, }
    ); // Mock API response
    render(<AudioUpload />);

    const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mpeg' });
    const uploadInput = screen.getByLabelText(/click to upload or drag and drop/i);
    const submitButton = screen.getByRole('button', { name: /upload/i });

    fireEvent.change(uploadInput, { target: { files: [file] } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockUploadAudio).toHaveBeenCalledTimes(1));

    const downloadLink = screen.getByRole('link', { name: /yes, download/i });
    expect(downloadLink).toBeInTheDocument();
  });

  test('closes download modal when close button is clicked', async () => {
    mockUploadAudio.mockResolvedValueOnce({ data: 'test-data',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
            headers: new AxiosHeaders(), 
            method: 'post',
            url: '/upload', 
          }, }
    ); // Mock API response
    render(<AudioUpload />);

    const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mpeg' });
    const uploadInput = screen.getByLabelText(/click to upload or drag and drop/i);
    const submitButton = screen.getByRole('button', { name: /upload/i });

    fireEvent.change(uploadInput, { target: { files: [file] } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByRole('link', { name: /yes, download/i })).toBeInTheDocument());

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    await waitFor(() => expect(screen.queryByText(/download the audio/i)).not.toBeInTheDocument());
  });
});
