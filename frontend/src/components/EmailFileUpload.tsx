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
  const [ invalidEmails, setInvalidEmails ] = useState<string[]>([]);

  const files = loadedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.parsedLines !== undefined ? `${file.parsedLines.length} emails` : ''}
    </li>
  ));

  const handleSendEmailsSuccess = (): void => {
    setNotification({
      message: 'Successfully sent the emails',
      status: 'success',
    });
    setLoadedFiles([]);
    setLoading(false);
  }

  const handleSendEmailsFailure = (response: UploadEmailsResponse | null = null): void => {
    setNotification({
      message: 'Sending emails failed.',
      status: 'error',
    });
    setLoading(false);
    if (response !== null) {
      setInvalidEmails(response.emails ?? []);
    }
  }

  const handleSendEmails = async (): Promise<any> => {
    setLoading(true);
    setNotification(defaultNotification);
    setInvalidEmails([]);
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
        <div className={notification.status}>
          <p>{notification.message}</p>
        </div>
      )}
      {loading && (
        <p>Loading...</p>
      )}
      {!loading && (
        <FileUploadComponent
          setLoadedFiles={setLoadedFiles}
          setLoading={setLoading}
          accept={{
            'text/plain': ['.txt',],
          }}/>
      )}
      <button type="button" onClick={handleSendEmails} disabled={loading || files.length === 0}>Send emails</button>
      {files.length > 0 && (
        <>
          <h4>Selected Files</h4>
          <ul>{files}</ul>
        </>
      )}
      {invalidEmails.length > 0 && (
        <>
          <h4>There was an error. Failed to send emails to some addresses:</h4>
          <ul>
            {invalidEmails.map(email => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
