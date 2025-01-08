
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('autoprefixer'),
              ],
            },
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;

/* styles/react-pdf-annotation-layer.css */
.react-pdf__Page__annotations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

import '../styles/react-pdf-annotation-layer.css';


'use client'; // Important for Next.js app directory or when using client-side rendering

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Set the worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  fileUrl: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<p>Loading PDF...</p>}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div>
        <p>
          Page {pageNumber} of {numPages || 0}
        </p>
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
          disabled={numPages && pageNumber >= numPages}
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
