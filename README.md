# Smart OCR Converter

AI-powered OCR system that converts handwritten notes into Word documents with intelligent diagram regeneration using Google Gemini API.

## Features

- Advanced OCR for handwritten text recognition
- AI-powered diagram recreation using matplotlib
- Modern React frontend with drag-and-drop interface
- Flask backend with comprehensive logging
- Automatic Word document generation

## Project Structure

```
project/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set environment variable:
```bash
set GEMINI_API_KEY=your_api_key_here
```

4. Run the server:
```bash
python app.py
```

Backend runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

Frontend runs on http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Drag and drop an image or click to browse
3. Click "Convert to Word" button
4. Wait for processing (may take 1-2 minutes)
5. Document downloads automatically

## API Endpoints

### GET /api/health
Health check endpoint

Response:
```json
{
  "status": "ok",
  "apiKeyConfigured": true
}
```

### POST /api/convert
Convert image to Word document

Request:
- Method: POST
- Content-Type: multipart/form-data
- Body: file (image file)

Response:
- Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
- Body: Word document file

## Environment Variables

- `GEMINI_API_KEY`: Google Gemini API key (required)
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000)

## Technology Stack

### Backend
- Flask: Web framework
- Flask-CORS: Cross-origin resource sharing
- python-docx: Word document generation
- matplotlib: Diagram generation
- requests: HTTP client for Gemini API

### Frontend
- React: UI framework
- axios: HTTP client
- Modern CSS with gradients and animations

## How It Works

1. User uploads an image through the React frontend
2. Frontend sends image to Flask backend via POST request
3. Backend encodes image to base64 and sends to Gemini API
4. Gemini API returns transcribed text and Python code for diagrams
5. Backend executes diagram code to generate PNG images
6. Backend creates Word document with text and generated diagrams
7. Document is sent back to frontend for download

## Logging

Backend uses Python logging module with DEBUG level for comprehensive debugging:
- API requests and responses
- Model selection
- Diagram generation
- File operations
- Error stack traces

## Notes

- Supports JPG, JPEG, PNG image formats
- Processing time depends on image complexity
- Requires active internet connection for Gemini API
- Temporary files are automatically cleaned up
- Diagram code execution timeout: 30 seconds
- API request timeout: 120 seconds

## Troubleshooting

### Backend not starting
- Verify GEMINI_API_KEY is set
- Check all dependencies are installed
- Ensure port 5000 is available

### Frontend not connecting
- Verify backend is running
- Check REACT_APP_API_URL matches backend URL
- Check browser console for CORS errors

### Conversion fails
- Check backend logs for detailed error messages
- Verify API key has proper permissions
- Ensure image is clear and readable
- Check internet connection

## License

MIT
