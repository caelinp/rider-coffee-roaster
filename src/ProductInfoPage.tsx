import React, { useState, useRef, useEffect, RefObject } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductInfoPage.css';
import DynamicImage from './DynamicImage';
import { useDispatch, useSelector } from 'react-redux';
import { addCoffeeBagItem, selectCartItems } from './CartSlice'
import CoffeeBagItem from './OrderItem';
import { useSwipeable } from 'react-swipeable';
import productsData from './json/products.json'; // Import the JSON file
import { sanitizeQuantityInput } from './ShoppingCartPage';
import Footer from './Footer';

const DEFAULT_WEIGHT: string = "340g";
const NO_SUBSCRIPTION: string = "none";

interface Product {
  id: string;
  name: string;
  images: { [key: string]: string };
  description: string;
  farmer: string;
  farm: string;
  origin: string;
  altitude: string;
  process: string;
  varietal: string;
  notes: string;
  roast: string;
  pricing: { [key: string]: string };
}

const ProductInfoPage = () => {
  const {id} = useParams();

  // Set up Redux store access
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  // Use the memoized selector function with useSelector
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    // This code will run whenever cartItems changes
  }, [cartItems]); // The array of dependencies ensures this only runs when cartItems changes

  const handleAddItem = (item: CoffeeBagItem) => {
    // Get the shopping cart button element by its id
    const cartButton = document.getElementById('shopping-cart-button-container');
  
    if (cartButton) {
      // Apply the scaling up effect by adding the CSS class
      cartButton.classList.add('scaling-up');
  
      // Remove the scaling up class after 1 second
      setTimeout(() => {
        cartButton.classList.remove('scaling-up');
  
        // Apply the scaling down effect by adding the CSS class
        cartButton.classList.add('scaling-down');
  
        // Remove the scaling down class after another 1 second
        setTimeout(() => {
          cartButton.classList.remove('scaling-down');
        }, 200);
      }, 200);
    }
    dispatch(addCoffeeBagItem(JSON.stringify(item)));
  }
  
  // Parse JSON product data to get data for product in question
  const foundProductData = productsData.products.find((product) => product.id === id);

  useEffect(() => {
    if (!foundProductData) {
      // Redirect to the homepage if the product data is not found
      navigate('/');
    }
  }, [foundProductData, navigate]);

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
    roast: foundProductData?.roast || "",
    pricing: Object.entries(foundProductData?.pricing || {}).reduce((acc, [key, value]) => {
      if (value?.weight) {
        acc[value.weight] = value.price || '';
      }
      return acc;
    }, {} as { [key: string]: string }),
  };

  // this is the initial weight value in the weight dropdown, and the associated price will be the first shown. size2 is 340g for now.
  const initialWeight = foundProductData?.pricing?.size2?.weight || DEFAULT_WEIGHT;

  const imagesArray: string[] = Object.values(product.images);
  const grindSizeOptions = ['Whole Bean', 'French Press', 'Drip', 'Espresso'];
  const subscriptionFrequencyOptions = [
    { frequency: 'every week', discount: 0.2 },
    { frequency: 'every 2 weeks', discount: 0.18 },
    { frequency: 'every month', discount: 0.15 },
  ];

  const [selectedGrindSize, setSelectedGrindSize] = useState('Whole Bean');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(initialWeight);
  const [selectedSubscriptionFrequency, setSelectedSubscriptionFrequency] = useState(NO_SUBSCRIPTION);
  const [isSubscriptionVisible, setIsSubscriptionVisible] = useState<boolean>(false);

    // Helper function to get the discount multiplier based on the selected subscription frequency
  const getDiscountMultiplier = () => {
    const selectedOption = subscriptionFrequencyOptions.find((option) => option.frequency === selectedSubscriptionFrequency);
    return selectedOption ? selectedOption.discount : 0;
  };
  const dropdownOptions = subscriptionFrequencyOptions.map((option) => {
    const formattedOption = `${option.frequency} (save ${option.discount * 100}%)`;
    return (
      <option key={option.frequency} value={option.frequency}>
        {formattedOption}
      </option>
    );
  });

  const toggleSubscription = () => {
    if (!isSubscriptionVisible) {
      setSelectedSubscriptionFrequency(subscriptionFrequencyOptions[0]['frequency']); // Set to the first option
    } else {
      setSelectedSubscriptionFrequency(NO_SUBSCRIPTION);
    }
    setIsSubscriptionVisible(!isSubscriptionVisible);
  };

  // Helper function to render the subscription dropdown
  const renderSubscriptionDropdown = () => {
    if (isSubscriptionVisible) {
      return (
        <div className="subscription-dropdown-container" >
          <select 
            className="option-input-field"
            id="subscription-dropdown"
            value={selectedSubscriptionFrequency }
            onChange={(e) => setSelectedSubscriptionFrequency(e.target.value)}
          >
            {dropdownOptions}
          </select>
        </div>
      );
    }
    return null; // Return null if the dropdown is not visible
  };

  
  useEffect(() => {
    // Calculate the total price whenever quantity or weight changes
    const calculatedTotalPrice = quantity * parseFloat(product.pricing[selectedWeight]);
    setTotalPrice(isNaN(calculatedTotalPrice) ? 0 : calculatedTotalPrice);
  }, [quantity, selectedWeight, product.pricing]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dynamicImageRef: RefObject<HTMLImageElement> = useRef(null);

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
    if (dynamicImageRef.current) {
      const imageWidth = dynamicImageRef.current.clientWidth;
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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleRightArrowClick(),
    onSwipedRight: () => handleLeftArrowClick(),
  });

  return (
    <div className="product-info-page">
      <div className="product-info-content-and-bottom">
        <div className="product-info-content">
          <div className="product-info-order-panel">
              <h1 className="product-header">{product.name}</h1>
              <div {...swipeHandlers}>
              <DynamicImage 
                className="product-main-image" 
                imageUrl={imagesArray[currentImageIndex]} 
                alt={product.name} 
                onClick={handleImageClick} 
                ref={dynamicImageRef} 
               />
               </div>
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
                  {Object.keys(product.pricing).map((option) => (
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
                    onKeyDown={(e) => {
                      // Prevent the period (.) character from being entered
                      if (e.key === '.') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => setQuantity(Math.max(0, Number(sanitizeQuantityInput(e.target.value))))}
                  />
                  <button
                    className="quantity-control" id="increase-quantity-control"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="total">
                <label className={`label-total ${selectedSubscriptionFrequency !== NO_SUBSCRIPTION ? 'discounted' : ''}`}>
                  Total:
                </label>
                <div className={`total-price-text ${selectedSubscriptionFrequency !== NO_SUBSCRIPTION ? 'discounted' : ''}`}>
                  {"$" + totalPrice.toFixed(2)}
                </div>
              </div>
              {selectedSubscriptionFrequency !== NO_SUBSCRIPTION && (
                <div className="discounted-total">
                  <label className="label-total-discount">After savings:</label>
                  <div className="total-discount-price-text">
                    {"$" + (totalPrice * (1 - getDiscountMultiplier())).toFixed(2)}
                  </div>
                </div>
              )}
            <div className="add-and-subscribe-button-container">
              <div className="subscribe-checkbox-container">
                <label className="label-subscribe" htmlFor="subscribe-checkbox">Subscribe & Save:</label>
                <input
                  className="option-input-field"
                  type="checkbox"
                  id="subscribe-checkbox"
                  onChange={toggleSubscription}
                  checked={isSubscriptionVisible}
                />
              </div>
              {renderSubscriptionDropdown()}
              <div className="add-to-cart-button-container">
                <button
                  id="add-to-cart-button"
                  disabled={quantity < 1}
                  onClick={()=>(handleAddItem(new CoffeeBagItem("0", product.id, quantity, selectedGrindSize, selectedWeight, selectedSubscriptionFrequency)))
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
              <h2>Roast</h2>
              <p>{product.roast.replace(/roast/gi, "")}</p>
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
        <Footer></Footer>
      </div>
    </div>
  );
};

export default ProductInfoPage;
