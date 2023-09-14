import React, { useEffect, useState, useRef } from 'react';
import defaultImage from './img/default_image.jpg';

interface DynamicImageProps {
  imageUrl: string;
  alt: string;
  className: string;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
  imgRef?: React.RefObject<HTMLImageElement>; // Add the imgRef prop
}

const DynamicImage: React.FC<DynamicImageProps> = ({ imageUrl, alt, className = 'img', onClick, imgRef }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    async function loadImage() {
      try {
        const module = await import(`./img/${imageUrl}`);
        setImageSrc(module.default);
      } catch (error) {
        setImageSrc(defaultImage);
      }
    }

    loadImage();
  }, [imageUrl]);

  if (!imageSrc) {
    return null;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      ref={imgRef} // Pass the imgRef to the img element
    />
  );
};

export default DynamicImage;
