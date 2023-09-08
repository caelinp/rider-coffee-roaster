// ProductInfoPage.tsx
import React, { useState, useRef, MouseEvent } from 'react';
import './ProductInfoPage.css';

import productImage1 from './img/product1.jpg';
import productImage2 from './img/product2.jpg';
import productImage3 from './img/product3.jpg';

const ProductInfoPage = () => {
  // Sample product data
  const product = {
    name: 'Trail Rider',
    images: [
      productImage1, // Replace with actual image URLs
      productImage2,
      productImage3,
    ],
    description: 'This Pacamara from our friends at La Haciendita is stunningly complex and full of beauty. Floral aromas, with a delicate body and a balanced acidity. Notes of grapefruit, vanilla bean, masala spices, and cacao.',
    farmer: 'Doña María Cristina Llach',
    farm: 'La Haciendita ',
    origin: 'Cerro El Tigre, Usulután, El Salvador',
    altitude: '1300-1650m',
    process: 'Washed',
    varietal: 'Pacamara',
    notes: 'grapefruit, clove, cinnamon, cacao, vanilla bean',
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    // Ensure imgRef.current is not null before accessing its properties
    if (imgRef.current) {
      // Get the image width
      const imageWidth = imgRef.current.clientWidth;

      // Calculate the click position relative to the image width
      const relativeClickX = e.nativeEvent.offsetX / imageWidth;

      // Determine if the left or right half of the image was clicked
      if (relativeClickX < 0.5) {
        // Clicked on the left half, go to the previous image
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
      } else {
        // Clicked on the right half, go to the next image
        setCurrentImageIndex((prevIndex) =>
          prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }
  };

  return (
    <div className="product-info-page">
      <div className="product-info-content">
        <div className="product-main-image-container">
          <div className="product-header">
            <h1>{product.name}</h1>
          </div>
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="product-main-image"
            onClick={handleImageClick}
            ref={imgRef}
          />
          <div className="image-dots">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`image-dot ${currentImageIndex === index ? 'active' : ''}`}
              ></div>
            ))}
          </div>
          <div className="add-to-cart-button">
            <button>Add to Cart</button>
          </div>
        </div>
        <div className="product-info">
          <div className="info-field">
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>
          <div className="info-field">
            <h2>Farmer</h2>
            <p>{product.farmer}</p>
          </div>
          <div className="info-field">
            <h2>Farm</h2>
            <p>{product.farm}</p>
          </div>
          <div className="info-field">
            <h2>Origin</h2>
            <p>{product.origin}</p>
          </div>
          <div className="info-field">
            <h2>Altitude</h2>
            <p>{product.altitude}</p>
          </div>
          <div className="info-field">
            <h2>Process</h2>
            <p>{product.process}</p>
          </div>
          <div className="info-field">
            <h2>Varietal</h2>
            <p>{product.varietal}</p>
          </div>
          <div className="info-field">
            <h2>Notes</h2>
            <p>{product.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoPage;
