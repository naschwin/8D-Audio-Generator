import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500" role="status"></div>
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500 ml-3" role="status"></div>
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 ml-3" role="status"></div>
    </div>
  );
};

export default LoadingAnimation;
