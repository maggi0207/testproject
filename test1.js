import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Button,
} from '@material-tailwind/react';

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

  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 2)); // 2x max zoom
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // 0.5x min zoom

  return (
    <Dialog open={open} handler={onClose} size="lg" className="max-w-7xl">
      {/* Header */}
      <DialogHeader className="bg-gray-100 text-gray-800">
        PDF Viewer
      </DialogHeader>

      {/* Body */}
      <DialogBody className="flex flex-col items-center justify-center p-4">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err: any) => console.error('FAILED LOADING DOC', err.message)}
          className="w-full flex justify-center"
        >
          {Array.from(new Array(numPages || 0), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              className="pdf-page my-2 shadow-lg"
            />
          ))}
        </Document>
      </DialogBody>

      {/* Footer with Zoom Controls */}
      <DialogFooter className="flex items-center justify-center gap-4 bg-gray-100">
        <Button color="blue" onClick={zoomOut} variant="outlined">
          Zoom Out
        </Button>
        <Button color="blue" onClick={zoomIn} variant="outlined">
          Zoom In
        </Button>
        <Button color="red" onClick={onClose} variant="filled">
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default PdfRenderer;
