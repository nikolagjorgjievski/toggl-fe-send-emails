import React, { ReactElement, useState } from 'react';
import FileUploadComponent from './FileUploadComponent';
import FileWithEmails from '../@types/file';
import { post } from '../utils/http';
import FILE_UPLOAD_API_URL from '../config/api';
import { NotificationType, defaultNotification } from '../@types/notification';
import { UploadEmailsResponse } from '../@types/emails';

export default function EmailFileUpload(): ReactElement {
  const [ loadedFiles, setLoadedFiles ] = useState<FileWithEmails[]>([]);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ notification, setNotification ] = useState<NotificationType>(defaultNotification);

  const files = loadedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.parsedLines !== undefined ? `${file.parsedLines.length} emails` : ''}
    </li>
  ));

  const handleSendEmailsSuccess = (): void => {
    setNotification({
      message: (<p>Successfully sent the emails</p>),
      status: 'success',
    });
    setLoadedFiles([]);
    setLoading(false);
  }

  const handleSendEmailsFailure = (response: UploadEmailsResponse | null = null): void => {
    const invalidEmails = response?.emails ?? [];
    setNotification({
      message: (
        <>
          {invalidEmails.length === 0
            ? <p>Sending emails failed.</p>
            : (
              <>
                <p>Failed to send emails to the following records:</p>
                <ul style={{ marginTop: '10px' }}>
                  {invalidEmails.map(email => (
                    <li key={email}>{email}</li>
                  ))}
                </ul>
              </>
            )
          }
        </>),
      status: 'error',
    });
    setLoading(false);
  }

  const handleSendEmails = async (): Promise<any> => {
    setLoading(true);
    setNotification(defaultNotification);
    const emailList = loadedFiles.flatMap(({ parsedLines }) => parsedLines);

    try {
      const response = await post(FILE_UPLOAD_API_URL + '/api/send', { emails: emailList });
      if (response.ok === true && response.status === 200) {
        handleSendEmailsSuccess();
      } else {
        handleSendEmailsFailure(await response.json());
      }
    } catch(error) {
      handleSendEmailsFailure();
    }
  }

  return (
    <>
      {notification.message !== undefined && (
        <div className={`notification ${notification.status ?? ''}`}>
          {notification.message}
        </div>
      )}
      {loading && (
        <p>Loading...</p>
      )}
      {!loading && (
        <>
          <FileUploadComponent
            setLoadedFiles={setLoadedFiles}
            setLoading={setLoading}
            accept={{
              'text/plain': ['.txt',],
            }}/>
          <div style={{ marginTop: '20px' }}>
            <button type="button" onClick={handleSendEmails} disabled={loading || files.length === 0}>
              Send emails
            </button>
          </div>
          {files.length > 0 && (
            <div style={{ marginTop: '20px', }}>
              <p className="sectionTitle">Selected Files</p>
              <ul style={{ marginTop: '10px' }}>{files}</ul>
            </div>
          )}
        </>
      )}
    </>
  );
}
