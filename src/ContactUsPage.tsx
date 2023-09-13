// ContactUsPage.tsx
import React, { useState } from 'react';
import './ContactUsPage.css';
import productImage1 from './img/product1.jpg'
import productImage2 from './img/product2.jpg'
import productImage3 from './img/product3.jpg'

interface Product {
  name: string;
  price: number;
  roast: string;
  ground: boolean;
  quantity: number;
  image: string;
}

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    products: Product[];
    isSubmitDisabled: boolean;
    areQuantitiesZero: boolean;
  }>({
    email: '',
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
    products: [
      { name: "Trail Rider", price: 19.99, roast: 'Medium', ground: false, quantity: 0, image: productImage1 },
      { name: 'Low Rider', price: 23.99, roast: 'Medium', ground: false, quantity: 0, image: productImage2 },
      { name: 'Easy Rider', price: 16.99, roast: 'Medium', ground: false, quantity: 0, image: productImage3 }
      // Add more sample products as needed
    ],
    isSubmitDisabled: true,
    areQuantitiesZero: true,
  });

  const updateFormAndCheckSubmitStatus = (newFormData: typeof formData) => {
    setFormData(newFormData);

    const areRequiredFieldsEmpty =
      newFormData.email === '' ||
      newFormData.firstName === '' ||
      newFormData.lastName === '' ||
      newFormData.streetAddress === '' ||
      newFormData.city === '' ||
      newFormData.province === '' ||
      newFormData.country === '' ||
      newFormData.postalCode === '';

    const areQuantitiesZero = newFormData.products.every(product => product.quantity === 0);

    const isSubmitDisabled = areRequiredFieldsEmpty || !areQuantitiesZero;

    return { areQuantitiesZero, isSubmitDisabled };
  };

  const handleProductChange = (index: number, field: keyof Product, value: string | boolean | number) => {
    const updatedProducts = formData.products.map((product, i) => {
      if (i === index) {
        return { ...product, [field]: value };
      }
      return product;
    });

    const { areQuantitiesZero, isSubmitDisabled } = updateFormAndCheckSubmitStatus({
      ...formData,
      products: updatedProducts,
    });

    setFormData({ ...formData, products: updatedProducts, isSubmitDisabled, areQuantitiesZero });
  };

  const decreaseQuantity = (index: number) => {
    const updatedProducts = [...formData.products];
    if (updatedProducts[index].quantity > 0) {
      updatedProducts[index].quantity--;

      const { areQuantitiesZero, isSubmitDisabled } = updateFormAndCheckSubmitStatus({
        ...formData,
        products: updatedProducts,
      });

      setFormData({
        ...formData,
        products: updatedProducts,
        isSubmitDisabled,
        areQuantitiesZero,
      });
    }
  };

  const increaseQuantity = (index: number) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index].quantity++;

    const { areQuantitiesZero, isSubmitDisabled } = updateFormAndCheckSubmitStatus({
      ...formData,
      products: updatedProducts,
    });

    setFormData({
      ...formData,
      products: updatedProducts,
      isSubmitDisabled,
      areQuantitiesZero,
    });
  };

  const calculateTotal = () => {
    const total = formData.products.reduce((acc, product) => {
      // Use parseFloat to convert the quantity to a number
      const quantity = product.quantity;
  
      // Check if quantity is NaN or an empty string and replace with 0
      const validQuantity = !isNaN(quantity) ? quantity : 0;
  
      return acc + product.price * validQuantity;
    }, 0);
  
    return isNaN(total) ? 0 : total;
  };
  return (
    <div className="contact-us-page">
      <div className="contact-us-content-and-bottom">
        <div className="contact-us-content">
          <h1 className="contact-us-header">Contact Us</h1>
          <br></br>
          <br></br>
          <div className="sub-section">
            <h2>Delivery Policy</h2>
            <p>We deliver to customers in Greater Vancouver every Friday.</p>
            <p>Contact us at delivery@ridercoffee.com for more information.</p>
          </div>
          <div className="sub-section">
            <h2>Business Inquiries</h2>
            <p>For business inquiries, please contact us at business@ridercoffee.com.</p>
            <p>We're excited to work with you!</p>
          </div>
          <div className="sub-section">
            <h2>Order Now</h2>
            <form>
              <div className="form-field">
                <label>Email *</label>
                <div className="form-field-input">
                  <input type="email" required />
                </div>
              </div>
              <div className="form-field">
                <label>First Name *</label>
                <div className="form-field-input">
                  <input type="text" required />
                </div>
              </div>
              <div className="form-field">
                <label>Last Name *</label>
                <div className="form-field-input">
                  <input type="text" required />
                </div>
              </div>
              <div className="form-field">
                <label>Street Address *</label>
                <div className="form-field-input">
                  <input type="text" required />
                </div>
              </div>
              <div className="form-field">
                <label>City *</label>
                <div className="form-field-input">
                  <input type="text" required />
                </div>
              </div>
              <div className="form-field">
                <label>Province/State *</label>
                <div className="form-field-input">
                  <input type="text" required />
                </div>
              </div>
              <div className="form-field">
                <label>Country *</label>
                <div className="form-field-input">
                  <input type="text" required />
                </div>
              </div>
              <div className="form-field">
                <label>Postal Code *</label>
                <div className="form-field-input">
                  <input type="text" required />
                </div>
              </div>
            </form>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Roast</th>
                  <th>Ground</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {formData.products.map((product, index) => (
                  <tr key={index}>
                    <td className="product-cell">
                      <div className="product-info-small">
                        <img src={product.image} alt='' className="product-image-small" />
                        <p>{product.name}</p>
                        <p className="product-price">${product.price.toFixed(2)}</p>
                      </div>
                    </td>
                    <td>
                      <select className="roast-select"
                        value={product.roast}
                        onChange={(e) => handleProductChange(index, 'roast', e.target.value)}
                      >
                        <option value="Light">Light</option>
                        <option value="Medium">Medium</option>
                        <option value="Dark">Dark</option>
                      </select>
                    </td>
                    <td>
                      <input className="check-box"
                        type="checkbox"
                        checked={product.ground}
                        onChange={(e) => handleProductChange(index, 'ground', e.target.checked)}
                      />
                    </td>
                    <td className="quantity-cell">
                      <br></br><br></br><br></br>
                      <button onClick={() => decreaseQuantity(index)}>-</button>
                      <input className="quantity-input-edit"
                        type="number"
                        min="0"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                      />
                      <button onClick={() => increaseQuantity(index)}>+</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="total-label">Total: ${calculateTotal().toFixed(2)}</p>
            <button disabled={formData.isSubmitDisabled}>Submit Order</button>
          </div>
        </div>
        <div className="black-bar-bottom"></div>
      </div>
    </div>
  );
};

export default ContactUsPage;
