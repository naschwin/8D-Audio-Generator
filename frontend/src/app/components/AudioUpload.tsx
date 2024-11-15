'use client';

import React, { useState } from 'react';
import { uploadAudio } from '@/app/utils/api';
import styles from '../styles/Home.module.css';
import NavBar from './NavBar';
import { toast, Toaster } from 'react-hot-toast';
import LoadingAnimation from './LoadingAnimation';
import DownloadModal from './DownloadModal';

export default function AudioUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [panningFrequency, setPanningFrequency] = useState(8);
  const [amplitude, setAmplitude] = useState(2);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await uploadAudio(
        file,
        panningFrequency,
        amplitude
      );

      const url = URL.createObjectURL(new Blob([response.data]));
      setDownloadLink(url);
      setFile(null)
    } catch (error) {
      console.error('Error uploading audio', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setFile(e.target.files ? e.target.files[0] : null);
  }

  const handleModalClose = () => {
    setDownloadLink(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  }

  return (
    <div className={styles.container}>

      <NavBar/>
      <Toaster position='top-right' toastOptions={{
        duration: 2000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}/>

      <div className="w-full max-w-sm p-4 m-16 rounded-lg shadow sm:p-6 md:p-8 bg-gray-800 bg-opacity-20">
        <form onSubmit={handleSubmit} >
          <div  onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
              <label htmlFor="dropzone-file" className="flex flex-col mb-8 items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800 bg-gray-700 hover:bg-gray-100 border-gray-600 hover:border-gray-500 hover:bg-gray-600 bg-opacity-30 hover:bg-opacity-40">
                  <div className="flex flex-col items-center justify-center">
                      <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-white-400">
                        {file ? file.name : (
                          <>
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </>
                        ) } 
                      </p>
                      <p className="text-xs text-white-400">MP3 (15MB Max)</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className={styles.fileInputHidden}
                  />
              </label>
          </div>
          <div>
            <div className={styles.sliders}>
              <label className="value text-center text-white mb-5" >Panning Frequency: {panningFrequency}</label>
              <input className={styles.slider} value={panningFrequency}
                    max="15" min="1" type="range" 
                    onChange={(e) => setPanningFrequency(Number(e.target.value))}/>
            </div>
            <div className={styles.sliders}>
              <label className="value text-center text-white mb-5" >Amplitude: {amplitude}</label>
              <input className={styles.slider} value={amplitude}
                    max="10" min="1" type="range" 
                    onChange={(e) => setAmplitude(Number(e.target.value))}/>
            </div>
          </div>
          <div className='w-full flex justify-center'>
            { isProcessing ? (
                <LoadingAnimation/>
            ) :
            (
              <button type="submit" className={styles.submitButton}>
                Upload
                <div className={styles.star_1}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  style={{
                    shapeRendering: "geometricPrecision",
                    textRendering: "geometricPrecision",
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                  }}
                  viewBox="0 0 784.11 815.53"
                >
                  <defs></defs>
                  <g id="Layer_x0020_1">
                    <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                    <path
                      className={styles.fil0}
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    ></path>
                  </g>
                </svg>
                </div>
                <div className={styles.star_2}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    style={{
                      shapeRendering: "geometricPrecision",
                      textRendering: "geometricPrecision",
                      fillRule: "evenodd",
                      clipRule: "evenodd",
                    }}
                    viewBox="0 0 784.11 815.53"
                  >
                    <defs></defs>
                    <g id="Layer_x0020_1">
                      <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                      <path
                        className={styles.fil0}
                        d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className={styles.star_3}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    style={{
                      shapeRendering: "geometricPrecision",
                      textRendering: "geometricPrecision",
                      fillRule: "evenodd",
                      clipRule: "evenodd",
                    }}
                    viewBox="0 0 784.11 815.53"
                  >
                    <defs></defs>
                    <g id="Layer_x0020_1">
                      <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                      <path
                        className={styles.fil0}
                        d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className={styles.star_4}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    style={{
                      shapeRendering: "geometricPrecision",
                      textRendering: "geometricPrecision",
                      fillRule: "evenodd",
                      clipRule: "evenodd",
                    }}
                    viewBox="0 0 784.11 815.53"
                  >
                    <defs></defs>
                    <g id="Layer_x0020_1">
                      <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                      <path
                        className={styles.fil0}
                        d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className={styles.star_5}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    style={{
                      shapeRendering: "geometricPrecision",
                      textRendering: "geometricPrecision",
                      fillRule: "evenodd",
                      clipRule: "evenodd",
                    }}
                    viewBox="0 0 784.11 815.53"
                  >
                    <defs></defs>
                    <g id="Layer_x0020_1">
                      <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                      <path
                        className={styles.fil0}
                        d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className={styles.star_6}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    style={{
                      shapeRendering: "geometricPrecision",
                      textRendering: "geometricPrecision",
                      fillRule: "evenodd",
                      clipRule: "evenodd",
                    }}
                    viewBox="0 0 784.11 815.53"
                  >
                    <defs></defs>
                    <g id="Layer_x0020_1">
                      <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                      <path
                        className={styles.fil0}
                        d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                      ></path>
                    </g>
                  </svg>
                </div>
              </button>
            )}
          </div>
        </form>
      </div>

      {downloadLink && (
        <DownloadModal downloadLink={downloadLink} onClose={handleModalClose}/>
      )}
    </div>
  );
}