import React from 'react';
import './ImagePreview.css';

const ImagePreview = ({ image, onRetake, onSubmit, isLoading, onCancel }) => {
  return (
    <div className="image-preview">
      <img src={image} alt="Captured" />
      <div className="button-group">
        {!isLoading ? (
          <>
            <button className="btn btn-secondary" onClick={onRetake} disabled={isLoading}>
              Retake
            </button>
            <button className="btn btn-primary" onClick={onSubmit} disabled={isLoading}>
              Submit
            </button>
          </>
        ) : (
          <button className="btn btn-danger" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
