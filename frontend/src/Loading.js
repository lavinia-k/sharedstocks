import React from 'react';
import { ClipLoader } from 'react-spinners';

function Loading() {
  return (
    <div className="page loading">
      <ClipLoader sizeUnit="px" size={50} color="#218fbd" />
    </div>
  );
}

export default Loading;
