import React, { ReactElement, useCallback } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import FileWithEmails from '../@types/file';

interface FileUploadComponentTypes {
  setLoadedFiles: Function,
  setLoading: Function,
  accept?: Record<string, string[]>
}

export default function FileUploadComponent({ setLoadedFiles, setLoading, accept }: FileUploadComponentTypes): ReactElement {
  const onDrop = useCallback((acceptedFiles: FileWithEmails[]) => {
    const newLoadedFiles: FileWithEmails[] = [];
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => { console.log('file reading was aborted') }
      reader.onerror = () => { console.log('file reading has failed') }
      reader.onload = () => {
        setLoading(true);
        if (typeof reader.result !== 'string') {
          return;
        }
        const lines = reader.result.split(/[\r\n]+/g);
        lines.forEach(line => {
          const parsedLine = line.trim();
          if (parsedLine !== '') {
            if (typeof file.parsedLines === 'undefined') {
              file.parsedLines = [];
            }
            file.parsedLines.push(parsedLine);
          }
        });
        newLoadedFiles.push(file);
      }
      reader.onloadend = () => {
        if (newLoadedFiles.length === acceptedFiles.length) {
          setLoadedFiles(newLoadedFiles);
          setLoading(false);
        }
      }
      reader.readAsText(file);
    })

  }, []);

  const dropzoneParams: DropzoneOptions = { onDrop };
  if (accept !== undefined) {
    dropzoneParams.accept = accept;
  }
  const {getRootProps, getInputProps} = useDropzone(dropzoneParams);

  return (
    <section className="container">
      <div { ...getRootProps({ className: 'dropzone' }) }>
        <input { ...getInputProps() } />
        <p>Drag n drop some files here, or click to select files</p>
      </div>
    </section>
  );
}
