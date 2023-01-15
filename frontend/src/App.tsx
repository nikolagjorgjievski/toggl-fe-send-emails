import React, { ReactElement } from 'react';
import EmailFileUpload from './components/EmailFileUpload';

function App(): ReactElement {
  return (
    <>
      <div className="container">
        <h1 className="title">Upload files and send emails</h1>
        <EmailFileUpload />
      </div>
    </>
  );
}

export default App;
