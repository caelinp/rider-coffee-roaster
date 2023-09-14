import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductInfoPage.css';
import DynamicImage from './DynamicImage';
import productsData from './json/products.json'; // Import the JSON file

const DEFAULT_WEIGHT: string = "340g";

interface Product {
  id: string;
  name: string;
  images: {[key: string] : string};
  description: string;
  farmer: string;
  farm: string;
  origin: string;
  altitude: string;
  process: string;
  varietal: string;
  notes: string;
  pricing:
  Array<{
      weight: string;
      price: string;
    }>;
}

const ProductInfoPage = () => {
  const {id, productName } = useParams();
  const foundProductData = productsData.products.find((product) => product.id === id);
  console.log(foundProductData);
  
  const product: Product = {
    id: decodeURIComponent(foundProductData?.id || ""),
    name: decodeURIComponent(foundProductData?.productName || ""),
    images: Object.entries(foundProductData?.images || {}).reduce((acc, [key, value]) => {
     acc[key] = decodeURIComponent(value);
     return acc;
   }, {} as { [key: string]: string }),
    description: decodeURIComponent(foundProductData?.description || ""),
    farmer: foundProductData?.farmer || "",
    farm: foundProductData?.farm || "",
    origin: foundProductData?.origin || "",
    altitude: foundProductData?.altitude || "",
    process: foundProductData?.process || "",
    varietal: foundProductData?.varietal || "",
    notes: foundProductData?.notes || "",
    pricing: Object.entries(foundProductData?.pricing || {}).map(([key, value]) => ({
     weight: value.weight || '',
     price: value.price || '',
   })),
  };

  // this is the initial weight value in the weight dropdown, and the associated price will be the first shown. size2 is 340g for now.
  const initialWeight = foundProductData?.pricing?.size2?.weight || DEFAULT_WEIGHT;

  const imagesArray: string[] = Object.values(product.images);
  const grindSizeOptions = ['Whole Bean', 'Coarse', 'Medium-Coarse', 'Medium', 'Fine', 'Extra Fine'];
  const [selectedGrindSize, setSelectedGrindSize] = useState('Whole Bean');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  
  const weightPrices: { [weight: string]: string } = {}; // map of weight price key value pairs
  for (const key in product.pricing) {
    if (product.pricing.hasOwnProperty(key)) {
      const weight = product.pricing[key].weight;
      const price = product.pricing[key].price;
      weightPrices[weight] = price;
    }
  }

  const [selectedWeight, setSelectedWeight] = useState(initialWeight);
  console.log(weightPrices);

  useEffect(() => {
    // Calculate the total price whenever quantity or weight changes
    const calculatedTotalPrice = quantity * parseFloat(weightPrices[selectedWeight]);
    setTotalPrice(isNaN(calculatedTotalPrice) ? 0 : calculatedTotalPrice);
  }, [quantity, selectedWeight, weightPrices, product]);



  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    console.log("here");
    e.preventDefault(); // Prevent the default behavior if needed
    if (imgRef.current) {
      const imageWidth = imgRef.current.clientWidth;
      const relativeClickX = e.nativeEvent.offsetX / imageWidth;
      let num_images: number = imagesArray.length || 0;
      if (relativeClickX < 0.5) {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? num_images - 1 : prevIndex - 1
        );
      } else {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === num_images - 1 ? 0 : prevIndex + 1
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
            <DynamicImage className="product-main-image" imageUrl={imagesArray[currentImageIndex]} alt={product.name} onClick={handleImageClick} imgRef={imgRef} />
            <div className="image-dots">
            {Object.keys(product.images).map((key, index) => (
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
                  {Object.keys(weightPrices).map((option) => (
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
                <span className="total-price-text">
                {"$" + totalPrice.toFixed(2)}
              </span>
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

          <div className="product-info-panel">
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
