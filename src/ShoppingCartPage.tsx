import React, { useState, useEffect, useMemo } from 'react';
import './ShoppingCartPage.css';

import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import productsData from './json/products.json';
import { updateCoffeeBagItem, removeCoffeeBagItem, clearCart, CartState } from './CartSlice';
import CoffeeBagOrderItem from './OrderItem';
import DynamicImage from './DynamicImage';

interface Product {
  id: string;
  name: string;
  image: string;
  pricing: { [key: string]: string };
}

const ShoppingCartPage = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const grindSizeOptions = ['Whole Bean', 'Coarse', 'Medium-Coarse', 'Medium', 'Fine', 'Extra Fine'];
  const [cartItemsWithProductInfo, setCartItemsWithProductInfo] = useState<{ product: Product; coffeeBagOrderItem: CoffeeBagOrderItem; price: string }[]>([]);
  const [coffeeBagOrderItems, setCoffeeBagOrderItems] = useState<CoffeeBagOrderItem[]>([]);

  const dispatch = useDispatch();

  // Create Memoized selector to get all cart items
  const selectCartItems = useMemo(() => {
    return createSelector(
      (state: { cart: CartState }) => state.cart.items,
      (items) => JSON.parse(items)
    );
  }, []);

  // Use the memoized selector function with useSelector
  const cartItemsFromStore = useSelector((state: { cart: CartState }) => selectCartItems(state));

  // Convert the cart items to CoffeeBagOrderItem objects
  // Define your function to calculate coffeeBagOrderItems using arrow function
  const generateCoffeeBagOrderItems = (cartItemsFromStore: string[]) => {
    const coffeeBagOrderItems: CoffeeBagOrderItem[] = cartItemsFromStore.map((item: string) => {
      return CoffeeBagOrderItem.fromObject(item); // Use the appropriate method to convert JSON to CoffeeBagOrderItem
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
  const generateCartItemsWithProductInfo = (coffeeBagOrderItems: CoffeeBagOrderItem[]) => {
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
  }

  useEffect(() => {
    setCartItemsWithProductInfo(generateCartItemsWithProductInfo(coffeeBagOrderItems));
  }, [coffeeBagOrderItems]);

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
    // Implement your close cart logic here
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
    const quantityUpdate = e.target.value;
    if (typeof quantityUpdate === 'number') {
      if (Number.isInteger(quantityUpdate)) {
        if (quantityUpdate > 0) {
          orderItem.setOrderQuantity(parseInt(e.target.value));
          dispatch(updateCoffeeBagItem(orderItem.toJSONString()));
        }
      }
    }
  };

  const handleRemoveItem = (orderItem: CoffeeBagOrderItem) => {
    dispatch(removeCoffeeBagItem(orderItem.id));
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
            {cartItemsWithProductInfo.map((item) => (
              <div className="order-item" key={item!.coffeeBagOrderItem!.id || ''}>
                <div className="item-option" id="order-item-product-name-and-image-container">
                  <label className="order-item-product-name">{item!.product.name || ''}</label><br></br>
                  <DynamicImage className="order-item-image" imageUrl={item!.product?.image} alt={item!.product.name} />
                </div>
                <div className="item-option" id="weight-option-cart">
                  <label>Weight:</label><br></br>
                  <select className="option-input-field-cart" value={item!.coffeeBagOrderItem!.bagSize} onChange={(e) => handleWeightChange(e, item!.coffeeBagOrderItem)}>
                    {Object.keys(item!.product.pricing || {}).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="item-option" id="grind-size-option-cart">
                  <label>Grind Size:</label><br></br>
                  <select className="option-input-field-cart" value={item!.coffeeBagOrderItem!.groundSize} onChange={(e) => handleGrindSizeChange(e, item!.coffeeBagOrderItem)}>
                    {grindSizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="item-option" id="quantity-option-cart">
                  <label>Quantity:</label><br></br>
                  <input
                    className="option-input-field-cart"
                    id="quantity-input-cart"
                    type="number"
                    value={item!.coffeeBagOrderItem!.quantity === 0 ? "0" : item!.coffeeBagOrderItem!.quantity.toString().replace(/^0+/, '')}
                    onChange={(e) => handleQuantityChange(e, item!.coffeeBagOrderItem)}
                  />
                </div>
                <div className="item-option" id="price-label-and-text-cart">
                  <label>Price:</label>
                  <p className="price-text">${parseFloat(item.price).toFixed(2)}</p>
                </div>
                <div className="item-option">
                  <button className="remove-button" onClick={() => handleRemoveItem(item!.coffeeBagOrderItem)}>X</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <label>Total:</label>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
