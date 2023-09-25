// DynamicImage.tsx
import React, { useEffect, useState, forwardRef, ForwardedRef } from 'react';
import defaultImage from './img/default_image.jpg';

interface DynamicImageProps {
  imageUrl: string;
  alt: string;
  className: string;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
}

const DynamicImage = forwardRef(
  (props: DynamicImageProps, ref: ForwardedRef<HTMLImageElement>) => {
    const { imageUrl, alt, className = 'img', onClick } = props;
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
        ref={ref as React.Ref<HTMLImageElement>} // Explicitly cast ref
      />
    );
  }
);

export default DynamicImage;
