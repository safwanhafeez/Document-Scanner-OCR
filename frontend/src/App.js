import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [apiStatus, setApiStatus] = useState({ connected: false, apiWorking: false, checking: true });

  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/health`, { timeout: 5000 });
      setApiStatus({
        connected: true,
        apiWorking: response.data.apiWorking,
        checking: false
      });
    } catch (err) {
      setApiStatus({
        connected: false,
        apiWorking: false,
        checking: false
      });
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setSuccess(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setSuccess(false);
    } else {
      setError('Please drop a valid image file');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${apiBaseUrl}/api/convert`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `converted_${selectedFile.name.split('.')[0]}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setIsProcessing(false);
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err.response?.data?.error || 'Conversion failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Document Scanner</h1>
          <p className="subtitle">
            Transform handwritten notes into digital documents with AI-powered diagram generation
          </p>
          {!apiStatus.checking && (
            <div style={{ marginTop: '1rem' }}>
              {apiStatus.connected ? (
                apiStatus.apiWorking ? (
                  <div style={{ color: '#48bb78', fontSize: '0.875rem' }}>
                    ● Backend Connected | Gemini API Working
                  </div>
                ) : (
                  <div style={{ color: '#f6ad55', fontSize: '0.875rem' }}>
                    ● Backend Connected | Gemini API Not Working
                  </div>
                )
              ) : (
                <div style={{ color: '#fc8181', fontSize: '0.875rem' }}>
                  ● Backend Not Connected
                </div>
              )}
            </div>
          )}
        </header>

        <div className="card">
          {!previewUrl ? (
            <div
              className="dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="dropzone-text">Drop your image here or click to browse</p>
              <p className="dropzone-subtext">Supports JPG, JPEG, PNG</p>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="preview-container">
              <img src={previewUrl} alt="Preview" className="preview-image" />
              <div className="button-group">
                <button
                  className="button button-primary"
                  onClick={handleConvert}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner"></span>
                      Processing...
                    </>
                  ) : (
                    'Convert to Word'
                  )}
                </button>
                <button
                  className="button button-secondary"
                  onClick={handleReset}
                  disabled={isProcessing}
                >
                  Choose Another
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Document downloaded successfully
            </div>
          )}
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3>Text Recognition</h3>
            <p>Advanced OCR for handwritten notes</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3>Diagram Generation</h3>
            <p>AI recreates diagrams as digital plots</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>Fast Processing</h3>
            <p>Powered by Google Gemini AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
