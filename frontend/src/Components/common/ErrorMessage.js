// components/common/ErrorMessage.js
import React from 'react';

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <div className="error-icon">!</div>
      <p>{message}</p>
    </div>
  );
}


export default ErrorMessage;