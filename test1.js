import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Icon } from '@material-tailwind/react';
import { MdClose, MdZoomIn, MdZoomOut } from 'react-icons/md'; // React Icons

export interface PdfRendererProps {
  url: string;
  open: boolean;
  onClose: () => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfRenderer: React.FC<PdfRendererProps> = ({ url, open, onClose }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1); // Zoom level

  const onDocumentLoadSuccess = (props: any) => {
    setNumPages(props.numPages);
  };

  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 2)); // Max zoom 2x
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Min zoom 0.5x

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? '' : 'hidden'
      } bg-gray-900 bg-opacity-75`}
    >
      {/* Modal Content */}
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">PDF Viewer</h2>
          <Icon className="cursor-pointer text-red-500" onClick={onClose}>
            <MdClose size={24} />
          </Icon>
        </div>

        {/* Body */}
        <div className="p-4">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err: any) =>
              console.error('FAILED LOADING DOC', err.message)
            }
            className="flex justify-center"
          >
            {Array.from(new Array(numPages || 0), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={scale}
                className="pdf-page my-4 shadow-lg"
              />
            ))}
          </Document>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 flex items-center justify-center gap-4">
          <Icon
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={zoomOut}
          >
            <MdZoomOut size={24} />
          </Icon>
          <Icon
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={zoomIn}
          >
            <MdZoomIn size={24} />
          </Icon>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
