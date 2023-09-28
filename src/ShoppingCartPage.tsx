import React, { useState, useEffect, useCallback, useLayoutEffect, useMemo} from 'react';
import './ShoppingCartPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '@mui/material';
import productsData from './json/products.json';
import { updateCoffeeBagItem, removeCoffeeBagItem, clearCart, selectCartItems } from './CartSlice';
import CoffeeBagOrderItem from './OrderItem';
import DynamicImage from './DynamicImage';
import {formatString} from './AllProductsPage';
import Footer from './Footer';

const COMPANY_EMAIL_ADDRESS: string = "prestoncaelin@gmail.com";
const TAX_MULTIPLIER: number = 0.12;

interface Product {
  id: string;
  name: string;
  image: string;
  pricing: { [key: string]: string };
}

export const sanitizeInput = (input: string) => {
  return input.trim().replace(/\s+/g, ' ');
};

export const sanitizeQuantityInput = (input: string) => {
  let quantitySanitized = sanitizeInput(input);
  let quantityInteger = parseInt(quantitySanitized);
  return isNaN(quantityInteger) || quantityInteger < 0 ? 0 : quantityInteger;
};

const ShoppingCartPage = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const grindSizeOptions = ['Whole Bean', 'Coarse', 'Medium-Coarse', 'Medium', 'Fine', 'Extra Fine'];
  const subscriptionFrequencyOptions = useMemo(() => [
    { frequency: 'none', discount: 0 },
    { frequency: 'every week', discount: 0.2 },
    { frequency: 'every 2 weeks', discount: 0.18 },
    { frequency: 'every month', discount: 0.15 },
  ], []);  
  const [cartItemsWithProductInfo, setCartItemsWithProductInfo] = useState<{ product: Product; coffeeBagOrderItem: CoffeeBagOrderItem; price: string }[]>([]);
  const [coffeeBagOrderItems, setCoffeeBagOrderItems] = useState<CoffeeBagOrderItem[]>([]);
  const [isCheckoutEnabled, setIsCheckoutEnabled] = useState(false); // State variable for enabling checkout
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false); // State variable for rendering the email form
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const dispatch = useDispatch();
  const [isEmailValid, setIsEmailValid] = useState(true);
const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to get the discount multiplier based on the selected subscription frequency
  const getDiscountMultiplier = useCallback((selectedSubscriptionFrequency: string) => {
    const selectedOption = subscriptionFrequencyOptions.find((option) => option.frequency === selectedSubscriptionFrequency);
    return selectedOption ? selectedOption.discount : 0;
  }, [subscriptionFrequencyOptions]);

  const dropdownOptions = subscriptionFrequencyOptions.map((option) => {
    const formattedOption = `${option.frequency}`;
    return (
      <option key={option.frequency} value={option.frequency}>
        {formattedOption}
      </option>
    );
  });

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
          price: (parseFloat(product.pricing[coffeeBagItem.bagSize]) * coffeeBagItem.quantity * (1 - getDiscountMultiplier(coffeeBagItem.subscriptionFrequency))).toString()
        };
      }

      return null; // Handle the case where the product is not found
    }).filter(Boolean) as { product: Product; coffeeBagOrderItem: CoffeeBagOrderItem; price: string }[]; // Remove any null entries
  }, [getDiscountMultiplier])

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

  const taxTotal = totalPrice * TAX_MULTIPLIER;

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
    const quantityUpdate = sanitizeQuantityInput(e.target.value);
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
    } else if (event.key === '.') {
      event.preventDefault();
    }
  };

  const handleKeyPressFormField = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmitOrder();
    }
  };

  const handleKeyPressPhoneNumberField = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handlePhoneNumberBlur();
      handleSubmitOrder();
    } else if (event.key === 'Backspace') {
      setPhoneNumber("");
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
    setEmail(sanitizeInput(inputEmail));

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
  
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phoneNumberInput = e.target.value.replace(/\D/g, '')
    let phoneNumberString = "";
    if (phoneNumberInput)
    {
      const maxDigits = 11; // Max digits in a phone number including country code
      phoneNumberString = phoneNumberInput.toString().slice(0, maxDigits);
    }
    if (phoneNumberString.length >= 10)
    {
      setPhoneNumber(formatPhoneNumber(phoneNumberString));
    }
    else
    {
      setPhoneNumber(sanitizeInput(phoneNumberString));
    }
  };

  const formatPhoneNumber = (input: string): string => {
    const numericInput = input.replace(/\D/g, '');
  
    if (numericInput.length === 11) {
      const countryCode = numericInput.charAt(0);
      const areaCode = numericInput.slice(1, 4);
      const middlePart = numericInput.slice(4, 7);
      const lastPart = numericInput.slice(7);
      return `+${countryCode}-(${areaCode})-${middlePart}-${lastPart}`;
    } else if (numericInput.length === 10) {
      const areaCode = numericInput.slice(0, 3);
      const middlePart = numericInput.slice(3, 6);
      const lastPart = numericInput.slice(6);
      return `(${areaCode})-${middlePart}-${lastPart}`;
    } else {
      return input;
    }
  };

  const handlePhoneNumberBlur = () => {
    setPhoneNumber(formatPhoneNumber(phoneNumber));
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
    // Check if all required fields are filled
    if (
      !isFormComplete ||
      !isCheckoutEnabled ||
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
  const tab = '    ';

  // Construct the email content using cartItemsWithProductInfo and form fields
  const emailContent =
    'New coffee order for ' +
    name +
    '!' + lineBreak + lineBreak +
    'Customer Information:' + lineBreak + lineBreak +
    tab + 'Name: ' +
    sanitizeInput(name) + lineBreak +
    tab + 'Email: ' +
    sanitizeInput(email) + lineBreak +
    tab + 'Phone Number: ' +
    sanitizeInput(phoneNumber) + lineBreak +
    tab + 'Street Address: ' +
    sanitizeInput(streetAddress) + lineBreak +
    tab + 'City: ' +
    sanitizeInput(city) + lineBreak +
    tab + 'Province/State: ' +
    sanitizeInput(province) + lineBreak +
    tab + 'Country: ' +
    sanitizeInput(country) + lineBreak +
    tab + 'Postal Code: ' +
    sanitizeInput(postalCode) + lineBreak + lineBreak +
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
    'Item Total: $' +
    totalPrice.toFixed(2) + lineBreak +
    'Tax Total: $' +
    taxTotal.toFixed(2) + lineBreak +
    'Order Total: $' +
    (parseFloat(totalPrice.toFixed(2)) + parseFloat(taxTotal.toFixed(2))).toFixed(2) + lineBreak + lineBreak +
    'Thank you!' + lineBreak + lineBreak;

    // Construct the mailto link
    const mailtoLink = 'mailto:' + COMPANY_EMAIL_ADDRESS + '?subject=' + emailSubject + '&body=' + emailContent;
    // Open the default email client with the mailto link
    window.location.href = mailtoLink;
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
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
          <button 
            className="go-to-products-button" onClick={()=> {navigate('/products/')}} 
          >Continue Shopping</button>
          
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
                value={ item!.coffeeBagOrderItem!.quantity === 0 ? "0" : item!.coffeeBagOrderItem!.quantity.toString().replace(/^0+/, '')}
                onChange={(e) => handleQuantityChange(e, item!.coffeeBagOrderItem)}
                onBlur={() => handleQuantityBlur(item!.coffeeBagOrderItem)}
                onKeyDown={(e) => handleKeyPressQuantity(e, item!.coffeeBagOrderItem)}
              />
            </div>
            <div className="item-option" id="subscription-option-cart">
              <label>Subscription:</label>
              <select className="option-input-field-cart" value={item!.coffeeBagOrderItem!.subscriptionFrequency} onChange={(e) => handleSubscriptionChange(e, item!.coffeeBagOrderItem)}>
                {dropdownOptions}
              </select>
            </div>
        </div>
        <div className="price-and-remove-container">
          <div className="item-option" id="price-label-and-text-cart">
            <label>Price:</label>
            <p className="price-text">${(parseFloat(item.price)).toFixed(2)}</p>
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
          <p id="order-form-instructions">Please fill out all required fields. When you are done, press Submit Order. This will generate an order email in your device's mail client. <br></br><br></br></p>
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
            <label>Phone Number </label>
            <div className="form-field-input">
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                onKeyDown={(e) => handleKeyPressPhoneNumberField(e)}
                onBlur={handlePhoneNumberBlur}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
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
          <p className="required-field-text"><strong>* Required Field</strong></p>
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
            <div className="cart-total-before-tax">
              <label>{"Items total: "}</label>
              <p className="cart-total-price-before-tax-text">${totalPrice.toFixed(2)}</p>
            </div>
            <div className="tax-total">
              <label>{"Tax: "}</label>
              <p className="tax-total-price-text">${taxTotal.toFixed(2)}</p>
            </div>
            <div className="cart-total-after-tax">
              <label><strong>{"Order total: "}</strong></label>
              <p className="cart-total-price-after-tax-text"><strong>${(parseFloat(totalPrice.toFixed(2)) + parseFloat(taxTotal.toFixed(2))).toFixed(2)}</strong></p>
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
        <Footer></Footer>
    </div>
    <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal">
          <div className="modal-content">
            <p id="modal-title">Have you sent your order email?</p>
            <div className="modal-buttons-container">
              <button
                className="modal-button"
                onClick={() => {
                  closeModal();
                  handleClearCart();
                  navigate('/products');
                }}
              >
                Yes! Clear Cart
              </button>
              <button
                className="modal-button"
                onClick={closeModal}
              >
                No, Return to Cart
              </button>
            </div>
          </div>
        </div>
      </Modal>
  </div>
);
};

export default ShoppingCartPage;
