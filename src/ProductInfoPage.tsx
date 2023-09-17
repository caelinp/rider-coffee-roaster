import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import './ProductInfoPage.css';
import DynamicImage from './DynamicImage';
import { useDispatch, useSelector } from 'react-redux';
import { addCoffeeBagItem, CartState } from './CartSlice'
import CoffeeBagItem from './OrderItem';
import { createSelector } from 'reselect'; // Import createSelector


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

  // Set up Redux store access
  const dispatch = useDispatch();

  
  // Create Memoized selector to get all cart items
  const selectCartItems = useMemo(() => {
    return createSelector(
      (state: { cart: CartState }) => state.cart.items,
      (items) => JSON.parse(items)
    );
  }, []);

  // Use the memoized selector function with useSelector
  const cartItems = useSelector((state: { cart: CartState }) => selectCartItems(state));

  useEffect(() => {
    // This code will run whenever cartItems changes
    console.log(cartItems);
  }, [cartItems]); // The array of dependencies ensures this only runs when cartItems changes

  const handleAddItem = (item: CoffeeBagItem) => {
    dispatch(addCoffeeBagItem(item.toJSONString()))
  };
  
  // Parse JSON product data to get data for product in question
  const foundProductData = productsData.products.find((product) => product.id === id);
  
  const product: Product = {
    id: foundProductData?.id || "",
    name: foundProductData?.productName || "",
    images: Object.entries(foundProductData?.images || {}).reduce((acc, [key, value]) => {
     acc[key] = value;
     return acc;
   }, {} as { [key: string]: string }),
    description: foundProductData?.description || "",
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

  useEffect(() => {
    // Calculate the total price whenever quantity or weight changes
    const calculatedTotalPrice = quantity * parseFloat(weightPrices[selectedWeight]);
    setTotalPrice(isNaN(calculatedTotalPrice) ? 0 : calculatedTotalPrice);
  }, [quantity, selectedWeight, weightPrices]);



  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleLeftArrowClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imagesArray.length - 1 : prevIndex - 1
    );
  };

  const handleRightArrowClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imagesArray.length - 1 ? 0 : prevIndex + 1
    );
  };

  
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
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
              <div className="image-arrow-left" id="left-arrow" onClick={handleLeftArrowClick}></div>
              {Object.keys(product.images).map((key, index) => (
                <div
                  key={index}
                  className={`image-dot ${currentImageIndex === index ? 'active' : ''}`}
                ></div>
              ))}
              <div className="image-arrow-right" id="right-arrow" onClick={handleRightArrowClick}></div>
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
                  id="grind-size"
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
              <div className="option" id="quantity-option">
                <label className="label-quantity" htmlFor="quantity">Quantity:</label>
                <div className="quantity-input">
                  <button
                    className="quantity-control" id="decrease-quantity-control"
                    onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  >
                    -
                  </button>
                  <input className="option-input-field"
                    id="quantity"
                    type="number"
                    value={quantity === 0 ? "0" : quantity.toString().replace(/^0+/, '')}
                    onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                  />
                  <button
                    className="quantity-control" id="increase-quantity-control"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="option" id="total">
                <label className="label-total">Total:</label>
                <span className="total-price-text">
                {"$" + totalPrice.toFixed(2)}
              </span>
              </div>
            </div>
            <div className="add-and-subscribe-button-container">
              <div className="subscribe-button-container">
                <button id="subscribe-button">Subscribe and Save</button>
              </div>
              <div className="add-to-cart-button-container">
                <button
                  id="add-to-cart-button"
                  disabled={quantity < 1}
                  style={{ backgroundColor: quantity < 1 ? 'grey' : '' }}
                  onClick={()=>(handleAddItem(new CoffeeBagItem(product.id, product.name, quantity, selectedGrindSize, selectedWeight)))
                  }
                >
                  Add to Cart
                </button>
              </div>
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
