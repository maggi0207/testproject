import React, { useEffect, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

const XmlComparison = () => {
  const [xml1, setXml1] = useState('');
  const [xml2, setXml2] = useState('');

  // Function to fetch XML file content
  const fetchXmlFile = async (filePath, setXml) => {
    try {
      const response = await fetch(filePath);
      const text = await response.text();
      setXml(text);
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  useEffect(() => {
    // Fetch both XML files from the public directory on component mount
    fetchXmlFile('/oldFile.xml', setXml1);
    fetchXmlFile('/newFile.xml', setXml2);
  }, []);

  return (
    <div>
      <h2>XML Comparison Tool</h2>

      <ReactDiffViewer
        oldValue={xml1}
        newValue={xml2}
        splitView={true}
        leftTitle="Original XML"
        rightTitle="Modified XML"
      />
    </div>
  );
};

export default XmlComparison;
