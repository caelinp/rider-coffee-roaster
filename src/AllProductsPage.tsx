import React, { useState } from 'react';
import './AllProductsPage.css';
import { Link } from 'react-router-dom';

import productImage1 from './img/product1.jpg'; // Use the same image for all products
import productImage2 from './img/product2.jpg'; // Use the same image for all products
import productImage3 from './img/product3.jpg'; // Use the same image for all products

const images: string[]= [
  productImage1,
  productImage2,
  productImage3,
]

const AllProductsPage = () => {

  // Sample product data
  const products = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    price: `$19.99`,
    imageUrl: images[index % images.length],
  }));

  // State for the search input
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="all-products-page">
      <div className="all-products-content">
        <h1 className="all-products-header">
          All Products
        </h1>
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search All Products"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="products-container">
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <Link to={`/sample-product`} key={product.id} className="product-link"> {/* update this once you have the ability to multiple product pages*/}
                <div className="product-card">
                  <img src={product.imageUrl} alt={product.name} className="product-image-gridview" />
                  <div className="product-details">
                    <h2 className="product-name">{product.name}</h2>
                    <p className="product-price">{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
