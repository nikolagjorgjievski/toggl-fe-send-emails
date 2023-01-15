import React, { ReactElement, useCallback, useMemo } from 'react';
import { DropzoneOptions, DropzoneRootProps, useDropzone } from 'react-dropzone';
import FileWithEmails from '../@types/file';

const baseStyle: DropzoneRootProps = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

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
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone(dropzoneParams);

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  return (
    <div className="container">
      <div { ...getRootProps({ style }) }>
        <input { ...getInputProps() } />
        <p>Click to select files, or drag and drop them here</p>
      </div>
    </div>
  );
}
