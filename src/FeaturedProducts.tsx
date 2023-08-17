import React, { useState, useEffect } from 'react';
import './FeaturedProducts.css';
import product1Img from './img/product1.jpg';
import product2Img from './img/product2.jpg';
import product3Img from './img/product3.jpg';

interface FeaturedProductsProps {
  show: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ show }) => {
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    if (show) {
      const images = [product1Img, product2Img, product3Img];
      let loadedImages = 0;

      const handleImageLoad = () => {
        loadedImages++;
        if (loadedImages === images.length) {
          setShowProducts(true);
        }
      };

      images.forEach((imageSrc) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = handleImageLoad;
      });
    }
  }, [show]);

  return (
    <div className={`featured-products ${showProducts ? 'visible' : ''}`}>
      {showProducts && (
        <>
          <div className="product-card">
            <img src={product1Img} alt="Featured Product 1" className="product-image" />
            <h1>Surf's Up</h1>
            <h2>19.99</h2>
          </div>

          <div className="product-card">
            <img src={product2Img} alt="Featured Product 2" className="product-image" />
            <h1>Midnight Rider</h1>
            <h2>23.99</h2>
          </div>

          <div className="product-card">
            <img src={product3Img} alt="Featured Product 3" className="product-image" />
            <h1>Chill Slopes</h1>
            <h2>16.99</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedProducts;
