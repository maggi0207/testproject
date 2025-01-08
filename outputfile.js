// components/PdfViewer.js
'use client'; // Important to ensure the component renders only on the client side

import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const PdfViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;



// pages/pdf.js
import dynamic from 'next/dynamic';

// Dynamically import PdfViewer to prevent SSR
const PdfViewer = dynamic(() => import('../components/PdfViewer'), { ssr: false });

const PdfPage = () => {
  const pdfUrl = "https://example.com/your-pdf-file.pdf"; // Replace with your PDF URL

  return (
    <div>
      <h1>PDF Viewer</h1>
      <PdfViewer fileUrl={pdfUrl} />
    </div>
  );
};

export default PdfPage;
