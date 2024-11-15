import React from 'react';

interface DownloadModalProps {
  downloadLink: string;
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ downloadLink, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative p-4 w-full max-w-md max-h-full ">
        <div className="relative rounded-lg shadow bg-gray-700 bg-opacity-80">
        <button type="button" onClick={onClose} className="absolute top-3 end-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" data-modal-hide="popup-modal">
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
        </button>
        <div className="p-4 md:p-5 text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-400">Download the audio?</h3>
            <a href={downloadLink} download="8d_audio.mp3" onClick={onClose} className="bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-1.5 rounded-md hover:brightness-150 active:opacity-75 outline-none duration-300 group">
                Yes
            </a>
            <button onClick={onClose} type="button" className="bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-1.5 rounded-md hover:brightness-150 active:opacity-75 outline-none duration-300 group">No, cancel</button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
