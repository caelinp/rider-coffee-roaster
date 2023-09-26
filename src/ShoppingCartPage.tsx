import React, { useState, useEffect, useCallback, useLayoutEffect} from 'react';
import './ShoppingCartPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import productsData from './json/products.json';
import { updateCoffeeBagItem, removeCoffeeBagItem, clearCart, selectCartItems } from './CartSlice';
import CoffeeBagOrderItem from './OrderItem';
import DynamicImage from './DynamicImage';
import {formatString} from './AllProductsPage';

const COMPANY_EMAIL_ADDRESS: string = "prestoncaelin@gmail.com";

interface Product {
  id: string;
  name: string;
  image: string;
  pricing: { [key: string]: string };
}

const ShoppingCartPage = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const grindSizeOptions = ['Whole Bean', 'Coarse', 'Medium-Coarse', 'Medium', 'Fine', 'Extra Fine'];
  const subscriptionFrequencyOptions = ['none', 'every week', 'every 2 weeks', 'every month'];
  const [cartItemsWithProductInfo, setCartItemsWithProductInfo] = useState<{ product: Product; coffeeBagOrderItem: CoffeeBagOrderItem; price: string }[]>([]);
  const [coffeeBagOrderItems, setCoffeeBagOrderItems] = useState<CoffeeBagOrderItem[]>([]);
  const [isCheckoutEnabled, setIsCheckoutEnabled] = useState(false); // State variable for enabling checkout
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false); // State variable for rendering the email form
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const dispatch = useDispatch();
  const [isEmailValid, setIsEmailValid] = useState(true);

  const navigate = useNavigate();

  const cartItemsFromStore = useSelector(selectCartItems);

  const generateCoffeeBagOrderItems = (cartItemsFromStore: string[]) => {
    const coffeeBagOrderItems: CoffeeBagOrderItem[] = cartItemsFromStore.map((item: string) => {
      return CoffeeBagOrderItem.fromObject(item);
    });
    return coffeeBagOrderItems;
  }

  useEffect(() => {
    setCoffeeBagOrderItems(generateCoffeeBagOrderItems(cartItemsFromStore));
  }, [cartItemsFromStore]);

  // find the product object associated with the given CoffeeBagOrderItem
  const findProductByProductId = (productId: string) => {
    return productsData.products.find((product) => product.id === productId);
  };

  // Create the shopping cart items list, each element being an object with a CoffeeBagOrderItem and its associated product
  // this gets updated every time coffeeBagOrderItems is updated.
  const generateCartItemsWithProductInfo = useCallback((coffeeBagOrderItems: CoffeeBagOrderItem[]) => {
    return coffeeBagOrderItems.map((coffeeBagItem) => {
      const foundProduct = findProductByProductId(coffeeBagItem.productId);
      if (foundProduct) {
        const product: Product = {
          id: foundProduct?.id || '',
          name: foundProduct?.productName || '',
          image: foundProduct?.images?.bagImage || '',
          pricing: Object.entries(foundProduct?.pricing || {}).reduce((acc, [key, value]) => {
            if (value?.weight) {
              acc[value.weight] = value.price || '';
            }
            return acc;
          }, {} as { [key: string]: string }),
        };

        return {
          product: product,
          coffeeBagOrderItem: coffeeBagItem,
          price: (parseFloat(product.pricing[coffeeBagItem.bagSize]) * coffeeBagItem.quantity).toString()
        };
      }

      return null; // Handle the case where the product is not found
    }).filter(Boolean) as { product: Product; coffeeBagOrderItem: CoffeeBagOrderItem; price: string }[]; // Remove any null entries
  }, [])

  useEffect(() => {
    setCartItemsWithProductInfo(generateCartItemsWithProductInfo(coffeeBagOrderItems));
  }, [coffeeBagOrderItems, generateCartItemsWithProductInfo]);

  useEffect(() => {
    // Calculate the total price whenever cart items change
    if (cartItemsWithProductInfo) {
      const totalPrice = cartItemsWithProductInfo.reduce((total, item) => {
        return total + parseFloat(item.price || "0");
      }, 0);
      // Update the total price in your component state
      setTotalPrice(totalPrice);
    }
  }, [cartItemsWithProductInfo]);

  const handleCloseCart = () => {
    navigate('/products');
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLSelectElement>, orderItem: CoffeeBagOrderItem) => {
    orderItem.setOrderBagSize(e.target.value);
    dispatch(updateCoffeeBagItem(orderItem.toJSONString()));
  };

  const handleGrindSizeChange = (e: React.ChangeEvent<HTMLSelectElement>, orderItem: CoffeeBagOrderItem) => {
    orderItem.setOrderGroundSize(e.target.value);
    dispatch(updateCoffeeBagItem(orderItem.toJSONString()));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, orderItem: CoffeeBagOrderItem) => {
    const quantityUpdate = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value);
    orderItem.setOrderQuantity(quantityUpdate);
    dispatch(updateCoffeeBagItem(orderItem.toJSONString()));
  };

  const handleQuantityBlur = (orderItem: CoffeeBagOrderItem) => {
    if (orderItem.quantity === 0) {
      dispatch(removeCoffeeBagItem(orderItem.id));
    }
  };

  const handleKeyPressQuantity = (event: React.KeyboardEvent<HTMLInputElement>, orderItem: CoffeeBagOrderItem) => {
    if (event.key === 'Enter' && orderItem.quantity === 0) {
      dispatch(removeCoffeeBagItem(orderItem.id));
    }
  };

  const handleKeyPressFormField = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("here we are");
    if (event.key === 'Enter') {
      console.log("here we are");
      handleSubmitOrder();
    }
  };

  const handleRemoveItem = (orderItem: CoffeeBagOrderItem) => {
    dispatch(removeCoffeeBagItem(orderItem.id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleSubscriptionChange = (e: React.ChangeEvent<HTMLSelectElement>, orderItem: CoffeeBagOrderItem) => {
    orderItem.setSubscriptionFrequency(e.target.value);
    dispatch(updateCoffeeBagItem(orderItem.toJSONString()));
  }

  // Handler function for email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Regular expression pattern for a valid email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Check if the input email matches the pattern
    const isValid = emailPattern.test(inputEmail);

    // Update the state variable to track if the email is valid
    setIsEmailValid(isValid);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleStreetAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreetAddress(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProvince(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostalCode(e.target.value.toUpperCase());
  };

  // Handler function for submitting the order
  const handleSubmitOrder = () => {
    console.log("here we are");

    // Check if all required fields are filled
    if (
      email.trim() === '' ||
      name.trim() === '' ||
      streetAddress.trim() === '' ||
      city.trim() === '' ||
      province.trim() === '' ||
      country.trim() === '' ||
      postalCode.trim() === ''
    ) {
      // If any required field is empty, do not proceed with the submission
      return;
    }

  // Construct the email subject
  const emailSubject = 'Coffee Order for ' + name;

  // Define line break and tab as URL-encoded equivalents
  const lineBreak = '%0D%0A';
  const tab = '%09';

  // Construct the email content using cartItemsWithProductInfo and form fields
  const emailContent =
    'New coffee order for ' +
    name +
    '!' + lineBreak + lineBreak +
    'Customer Information:' + lineBreak + lineBreak +
    tab + 'Name: ' +
    name + lineBreak +
    tab + 'Email: ' +
    email + lineBreak +
    tab + 'Street Address: ' +
    streetAddress + lineBreak +
    tab + 'City: ' +
    city + lineBreak +
    tab + 'Province/State: ' +
    province + lineBreak +
    tab + 'Country: ' +
    country + lineBreak +
    tab + 'Postal Code: ' +
    postalCode + lineBreak + lineBreak +
    'Order Details:' + lineBreak + lineBreak +
    cartItemsWithProductInfo
      .map((item, index) => {
        return (
          tab + 'Item ' +
          (index + 1) + ':' + lineBreak +
          tab + tab + 'Product: ' +
          item.product.name + lineBreak +
          tab + tab + 'Quantity: ' +
          item.coffeeBagOrderItem.quantity + lineBreak +
          tab + tab + 'Bag Size: ' +
          item.coffeeBagOrderItem.bagSize + lineBreak +
          tab + tab + 'Grind Size: ' +
          item.coffeeBagOrderItem.groundSize + lineBreak +
          tab + tab + 'Subscription Frequency: ' +
          item.coffeeBagOrderItem.subscriptionFrequency + lineBreak +
          tab + tab + 'Price: $' +
          parseFloat(item.price).toFixed(2) + lineBreak
        );
      })
      .join(lineBreak + lineBreak) + lineBreak + lineBreak +
    'Order Total: $' +
    totalPrice.toFixed(2) + lineBreak + lineBreak +
    'Thank you!' + lineBreak + lineBreak;

    // Construct the mailto link
    const mailtoLink = 'mailto:' + COMPANY_EMAIL_ADDRESS + '?subject=' + emailSubject + '&body=' + emailContent;
    // Open the default email client with the mailto link
    window.location.href = mailtoLink;
  };

  // Check if all required form fields are filled
  const isFormComplete =
    isEmailValid &&
    email.trim() !== '' &&
    name.trim() !== '' &&
    streetAddress.trim() !== '' &&
    city.trim() !== '' &&
    province.trim() !== '' &&
    country.trim() !== '' &&
    postalCode.trim() !== '';

   // Helper function to render order items or empty cart message
  const renderOrderItems = () => {
    if (cartItemsWithProductInfo.length === 0) {
      
      // Render an empty cart message
      return (
        <div className="empty-cart-message">
          <p>
            Your cart is empty.
          </p>
        </div>
      );
    } else {
      // Render the list of order items
      return cartItemsWithProductInfo.map((item) => (
        <div className="order-item" key={item!.coffeeBagOrderItem!.id || ''}>
          <Link
            id="order-item-product-link"
            to={`/products/` + item!.product.id + "/" + formatString(item!.product.name) }
            key={item!.product.id}
            className="product-link"
            >
            <div className="item-option" id="order-item-product-name-and-image-container">
              <label className="order-item-product-name">{item!.product.name || ''}</label><br></br>
              <DynamicImage className="order-item-image" imageUrl={item!.product?.image} alt={item!.product.name} />
            </div>
          </Link>
          <div className="item-options">
            <div className="item-option" id="weight-option-cart">
              <label>Weight:</label>
              <select className="option-input-field-cart" value={item!.coffeeBagOrderItem!.bagSize} onChange={(e) => handleWeightChange(e, item!.coffeeBagOrderItem)}>
                {Object.keys(item!.product.pricing || {}).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="item-option" id="grind-size-option-cart">
              <label>Grind Size:</label>
              <select className="option-input-field-cart" value={item!.coffeeBagOrderItem!.groundSize} onChange={(e) => handleGrindSizeChange(e, item!.coffeeBagOrderItem)}>
                {grindSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="item-option" id="quantity-option-cart">
              <label>Quantity:</label>
              <input
                className="option-input-field-cart"
                id="quantity-input-cart"
                type="number"
                value={item!.coffeeBagOrderItem!.quantity === 0 ? "0" : item!.coffeeBagOrderItem!.quantity.toString().replace(/^0+/, '')}
                onChange={(e) => handleQuantityChange(e, item!.coffeeBagOrderItem)}
                onBlur={() => handleQuantityBlur(item!.coffeeBagOrderItem)}
                onKeyDown={(e) => handleKeyPressQuantity(e, item!.coffeeBagOrderItem)}
              />
            </div>
            <div className="item-option" id="subscription-option-cart">
              <label>Subscription:</label>
              <select className="option-input-field-cart" value={item!.coffeeBagOrderItem!.subscriptionFrequency} onChange={(e) => handleSubscriptionChange(e, item!.coffeeBagOrderItem)}>
                {subscriptionFrequencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
        </div>
        <div className="price-and-remove-container">
          <div className="item-option" id="price-label-and-text-cart">
            <label>Price:</label>
            <p className="price-text">${parseFloat(item.price).toFixed(2)}</p>
          </div>
          <div className="item-option">
            <button className="remove-button" onClick={() => handleRemoveItem(item!.coffeeBagOrderItem)}></button>
          </div>
        </div>
      </div>
      ));
    }
  };

  useEffect(() => {
    // Calculate the total price whenever cart items change
    if (cartItemsWithProductInfo) {
      const totalPrice = cartItemsWithProductInfo.reduce((total, item) => {
        return total + parseFloat(item.price || "0");
      }, 0);
      // Update the total price in your component state
      setTotalPrice(totalPrice);

      // Enable checkout if cart is not empty
      setIsCheckoutEnabled(cartItemsWithProductInfo.length > 0);
    }
  }, [cartItemsWithProductInfo]);

  const handleCheckout = () => {
    // Show the email form when the "Proceed to checkout" button is clicked
    setIsEmailFormVisible(true);
    scrollToEmailForm();
  };

  // Create the ref for the email form
  const emailFormRef = React.useRef<HTMLFormElement | null>(null);
  // Render the email form when it's visible
  const renderEmailForm = () => {
    if (isEmailFormVisible) {
      // Function to scroll the email form into view
      return (
        <form ref={emailFormRef} className="order-form">
          <h1>Order Form</h1>
          <p id="order-form-instructions">Please fill out all required fields. When you are done, press Submit Order.<br></br><br></br></p>
          <div className="form-field">
            <label>Email *</label>
            <div className="form-field-input">
              <input
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                onKeyDown={(e) => handleKeyPressFormField(e)}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Name *</label>
            <div className="form-field-input">
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                onKeyDown={(e) => handleKeyPressFormField(e)}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Street Address *</label>
            <div className="form-field-input">
              <input
                type="text"
                required
                value={streetAddress}
                onChange={handleStreetAddressChange}
                onKeyDown={(e) => handleKeyPressFormField(e)}
              />
            </div>
          </div>
          <div className="form-field">
            <label>City *</label>
            <div className="form-field-input">
              <input
                type="text"
                required
                value={city}
                onChange={handleCityChange}
                onKeyDown={(e) => handleKeyPressFormField(e)}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Province/State *</label>
            <div className="form-field-input">
              <input
                type="text"
                required
                value={province}
                onChange={handleProvinceChange}
                onKeyDown={(e) => handleKeyPressFormField(e)}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Country *</label>
            <div className="form-field-input">
              <input
                type="text"
                required
                value={country}
                onChange={handleCountryChange}
                onKeyDown={(e) => handleKeyPressFormField(e)}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Postal Code *</label>
            <div className="form-field-input">
              <input
                type="text"
                required
                value={postalCode}
                onChange={handlePostalCodeChange}
                onKeyDown={(e) => handleKeyPressFormField(e)}
              />
            </div>
          </div>
        </form>
      );
    }
    return null;
  };

  const scrollToEmailForm = () => {
    emailFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useLayoutEffect(() => {
    if (isEmailFormVisible) {
      scrollToEmailForm();
    }
  }, [isEmailFormVisible]);

  return (
    <div className="cart-page">
    <div className="cart-page-content-and-bottom">
      <div className="cart-page-content">
        <div className="cart-content">
          <div className="cart-summary">
            <div className="cart-header">
              <h1>Your Cart</h1>
              <button className="close-button" onClick={handleCloseCart}></button>
            </div>
            <div className="cart-item-count-and-clear">
              <p className="cart-item-count">
                {cartItemsWithProductInfo.length + (cartItemsWithProductInfo.length === 1 ? " Item in Cart" : " Items in Cart")} 
              </p>
              <button 
                className="clear-cart-button" onClick={handleClearCart} 
                disabled={cartItemsWithProductInfo.length === 0}
              >
                Clear Cart
              </button>
            </div>
          </div>
          <div className="order-items-container">
            {renderOrderItems()}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <label>{"Total: "}</label>
              <p className="cart-total-price-text">${totalPrice.toFixed(2)}</p>
            </div>
            <button
                className="checkout-button"
                onClick={handleCheckout}
                disabled={!isCheckoutEnabled} // Disable the button when the cart is empty
              >
                Proceed to checkout
              </button>
            </div>
            {/* Render the email form */}
            {renderEmailForm()}
            {isEmailFormVisible && (
              <button 
                className="submit-order-button"           
                onClick={handleSubmitOrder}
                disabled={!isCheckoutEnabled || !isFormComplete} // Disable the button if the form is not complete
            >
                Submit Order
              </button>
            )}
          </div>
        </div>
      <div className="black-bar-bottom"></div>
    </div>
  </div>
);
};

export default ShoppingCartPage;
