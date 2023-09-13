import React, { useState, useRef, MouseEvent } from 'react';
import './ProductInfoPage.css';

import productImage1 from './img/product1.jpg';
import productImage2 from './img/product2.jpg';
import productImage3 from './img/product3.jpg';

const ProductInfoPage = () => {
  const product = {
    name: 'Trail Rider',
    images: [
      productImage1,
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

  const weightOptions = ['250 grams', '340 grams', '500 grams'];
  const grindSizeOptions = ['Whole Bean', 'Coarse', 'Medium-Coarse', 'Medium', 'Fine', 'Extra Fine'];
  const [selectedWeight, setSelectedWeight] = useState('340 grams');
  const [selectedGrindSize, setSelectedGrindSize] = useState('Whole Bean');
  const [quantity, setQuantity] = useState(1);

  const weightPrices: { [key: string]: number }= {
    '250 grams': 18,
    '340 grams': 25,
    '500 grams': 30,
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
    if (imgRef.current) {
      const imageWidth = imgRef.current.clientWidth;
      const relativeClickX = e.nativeEvent.offsetX / imageWidth;
      if (relativeClickX < 0.5) {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
      } else {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }
  };

  return (
    <div className="product-info-page">
      <div className="product-info-content-and-bottom">
        <div className="product-info-content">
          <div className="product-info-order-panel">
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
            
            <div className="order-options">
              <div className="option">
                <label className="label-weight" htmlFor="weight">Weight:</label>
                <select className="option-input-field"
                  id="weight"
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                >
                  {weightOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="option">
                <label className="label-grind-size" htmlFor="grindSize">Grind Size:</label>
                <select className="option-input-field"
                  id="grindSize"
                  value={selectedGrindSize}
                  onChange={(e) => setSelectedGrindSize(e.target.value)}
                >
                  {grindSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="option">
                <label className="label-quantity" htmlFor="quantity">Quantity:</label>
                <div className="quantity-input">
                  <button
                    className="quantity-control"
                    onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  >
                    -
                  </button>
                  <input className="option-input-field"
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                  />
                  <button
                    className="quantity-control"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="total">
                <label className="label-total">Total:</label>
                <span className="total-price-text">${(quantity * weightPrices[selectedWeight]).toFixed(2)}</span>
              </div>
            </div>
            <div className="subscribe-button">
              <button>Subscribe and Save</button>
            </div>
            <div className="add-to-cart-button">
              <button
                disabled={quantity < 1}
                style={{ backgroundColor: quantity < 1 ? 'grey' : '' }}
                onClick={() => {
                  const orderConfig = {
                    'Product name': product.name,
                    'Quantity': quantity,
                    'Grind Size': selectedGrindSize,
                    'Weight': selectedWeight,
                  };
                  console.log(orderConfig);
                }}
              >
                Add to Cart
              </button>
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
        <div className="black-bar-bottom"></div>
      </div>
    </div>
  );
};

export default ProductInfoPage;
