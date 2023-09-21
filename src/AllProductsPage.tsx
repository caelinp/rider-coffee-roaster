import React, { useState } from 'react';
import './AllProductsPage.css';
import { Link } from 'react-router-dom';
import DynamicImage from './DynamicImage';
// Import the JSON data
import productsData from './json/products.json';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
}

export const formatString = (inputString: string) => {
  // Replace whitespace with hyphens, remove non-alphanumeric characters,
  // and convert to lowercase using regular expressions.
  const formattedString = inputString
    .replace(/\s+/g, '-') // Replace whitespace with hyphens
    .replace(/[^a-zA-Z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
    .toLowerCase(); // Convert to lowercase

  return formattedString;
}

const AllProductsPage = () => {
  // Create Product objects based on productsData.products
  const products: Product[] = productsData.products.map((productData, index) => ({
    id: productData.id || `${index + 1}`,
    name: productData.productName || `Product ${index + 1}`,
    imageUrl: productData.images.bagImage || '',
    price: productData.pricing.size2.price || "99.99"
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
      <div className="all-products-content-and-bottom">
        <div className="all-products-content">
          <div className="search-header-container">
            <h1 className="all-products-header">All Products</h1>
              <input
                className="search-input" 
                id = "product-search"
                type="text"
                placeholder="Search All Products"
                value={searchQuery}
                onChange={handleSearchChange}
              />
          </div>
          <div className="products-container">
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <Link
                  id="product-card-all-products-link"
                  to={`/rider-coffee-roaster/products/` + product.id + "/" + formatString(product.name) }
                  key={product.id}
                  className="product-card"
                >
                  <div className="product-image-gridview-container">
                    <DynamicImage className="product-image-gridview" imageUrl={product.imageUrl} alt={product.name} />
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="black-bar-bottom"></div>
      </div>
    </div>
  );
};

export default AllProductsPage;

