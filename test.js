import { Document, Page, pdfjs } from 'react-pdf';
import React, { useState } from 'react';

export interface PdfRendererProps {
  url: string;
}
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfRenderer: React.FC<PdfRendererProps> = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  function onDocumentLoadSuccess(props: any) {
    setNumPages(props.numPages);
  }

  return (
    <div className='pdf-wrapper'>
      {
        <Document
          className='pdf-document'
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err: any) => {
            console.error('FAILED LOADING DOC ', err.message);
          }}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              height={900}
              width={900}
              className='pdf-page'
              key={`page_${index + 1}`}
              pageNumber={index + 1}
            />
          ))}
        </Document>
      }
    </div>
  );
};

export default PdfRenderer;
