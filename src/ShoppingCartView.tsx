import React, { useState, useEffect } from 'react';
import './ShoppingCartView.css'; // Import your CSS file
import product1Image from './img/product1.jpg'
import product2Image from './img/product2.jpg'
import product3Image from './img/product3.jpg'
const sampleItems = [
  {
    id: '1',
    name: 'Easy Rider',
    image: product1Image,
    weight: '250g',
    grindSize: 'Whole Bean',
    quantity: 2,
    price: 10.99,
  },
  {
    id: '2',
    name: 'Trail Rider',
    image: product2Image,
    weight: '340g',
    grindSize: 'Medium',
    quantity: 1,
    price: 12.99,
  },
  {
    id: '3',
    name: 'Low Rider',
    image: product3Image,
    weight: '500g',
    grindSize: 'Coarse',
    quantity: 3,
    price: 15.99,
  },
];

const YourCart = () => {
  const [cartItems, setCartItems] = useState(sampleItems);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate the total price whenever cart items change
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    // Update the total price in your component state
    setTotalPrice(totalPrice);
  }, [cartItems]);

  const handleCloseCart = () => {
    // Implement your close cart logic here
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLSelectElement>, itemId: string) => {
    // Implement weight change logic here
  };

  const handleGrindSizeChange = (e: React.ChangeEvent<HTMLSelectElement>, itemId: string) => {
    // Implement grind size change logic here
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    // Implement quantity change logic here
    
    const updatedItems = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(0, Number(e.target.value))};
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const handleRemoveItem = (itemId: string) => {
    // Implement remove item logic here
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);
  };

  const handleCheckout = () => {
    // Implement checkout logic here
  };

  return (
    <div className="cart-page">
      <div className="cart-content-and-bottom">
        <div className="cart-content">
            <div className="cart-header">
                <h2>Your Cart</h2>
                <button className="close-button" onClick={handleCloseCart}>
                X
                </button>
            </div>
            <div className="order-items-container">
                {cartItems.map((item) => (
                <div className="order-item" key={item.id}>
                    <div className="item-option" id="order-item-product-name-and-image-container">
                        <label className="order-item-product-name">{item.name}</label><br></br>
                        <img className="order-item-image" src={item.image} alt={item.name} />
                    </div>
                    <div className="item-option" id="weight-option-cart">
                        <label>Weight:</label><br></br>
                        <select className="option-input-field-cart" value={item.weight} onChange={(e) => handleWeightChange(e, item.id)}>
                            <option value="250g">250g</option>
                            <option value="340g">340g</option>
                            <option value="500g">500g</option>
                        </select>
                    </div>
                    <div className="item-option" id="grind-size-option-cart">
                        <label>Grind Size:</label><br></br>
                        <select className="option-input-field-cart" value={item.grindSize} onChange={(e) => handleGrindSizeChange(e, item.id)}>
                            <option value="Whole Bean">Whole Bean</option>
                            <option value="Coarse">Coarse</option>
                            <option value="Medium-Coarse">Medium-Coarse</option>
                            <option value="Medium">Medium</option>
                            <option value="Fine">Fine</option>
                            <option value="Extra Fine">Extra Fine</option>
                        </select>
                    </div>
                    <div className="item-option" id="quantity-option-cart">
                        <label>Quantity:</label><br></br>
                        <input className="option-input-field-cart"
                            type="number"
                            value={item.quantity === 0 ? "0" : item.quantity.toString().replace(/^0+/, '')}
                            onChange={(e) => handleQuantityChange(e, item.id)}
                        />
                        </div>
                    <div className="item-option" id="price-label-and-text-cart">
                        <label>Price:</label>
                        <p className="price-text">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="item-option">
                        <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>X</button>
                    </div>
                </div>

                ))}
            </div>
            <div className="cart-total">
                <label>Total:</label>
                <p>${totalPrice.toFixed(2)}</p>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout
            </button>
        </div>
      </div>
    </div>
  );
};

export default YourCart;
