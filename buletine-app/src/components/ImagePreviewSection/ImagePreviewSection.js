import React from 'react';
import ImagePreview from '../ImagePreview';
import './ImagePreviewSection.css';

const ImagePreviewSection = ({ image, handleRetakeClick, handleSubmitClick, isLoading }) => (
  <div className="image-preview-section">
    <ImagePreview image={image} onRetake={handleRetakeClick} onSubmit={handleSubmitClick} isLoading={isLoading} />
  </div>
);

export default ImagePreviewSection;
