import React from 'react';
import './PullResultSection.css';

const PullResultSection = ({ image }) => {
  return (
    <div className="pull-result-section">
      <img src={image} alt="Captured" className="captured-image" />
    </div>
  );
};

export default PullResultSection;