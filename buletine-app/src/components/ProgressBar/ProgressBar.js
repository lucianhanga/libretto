import React from 'react';

const ProgressBar = ({ progress, label }) => {
  const indicators = [];
  for (let i = 0; i < 10; i++) {
    indicators.push(
      <div
        key={i}
        className={`absolute top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 rounded-full ${progress >= i * 10 ? 'bg-black' : 'bg-transparent'}`}
        style={{ left: `${i * 10}%` }}
      ></div>
    );
  }

  return (
    <div className="mt-5">
      <div className="relative w-full bg-gray-200 rounded overflow-hidden">
        <div className="h-5 bg-green-500" style={{ width: `${progress}%` }}></div>
        {indicators}
      </div>
      <div className="text-center mt-2 font-bold">{label}</div>
    </div>
  );
};

export default ProgressBar;
