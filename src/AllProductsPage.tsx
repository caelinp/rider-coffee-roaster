import React, { useState } from 'react';
import './AllProductsPage.css';
import { Link } from 'react-router-dom';
import DynamicImage from './DynamicImage';
// Import the JSON data
import productsData from './json/products.json';
import Footer from './Footer';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  roast: string;
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
    id: productData.id || '',
    name: productData.productName || '',
    imageUrl: productData.images.bagImage || '',
    price: productData.pricing.size1.price || '',
    roast: productData.roast || ''
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
                id="product-search"
                type="text"
                placeholder="Search All Products"
                value={searchQuery}
                onChange={handleSearchChange}
              />
          </div>
          <div className="products-container">
            <div className="products-grid">
              {filteredProducts.length === 0 ? (
                <p className="no-products-found">No products found.</p>
              ) : (
                filteredProducts.map((product) => (
                  <Link
                    id="product-card-all-products-link"
                    to={`/products/` + product.id + "/" + formatString(product.name)}
                    key={product.id}
                    className="product-card"
                  >
                    <DynamicImage className="product-image-gridview" imageUrl={product.imageUrl} alt={product.name} />
                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-roast">{product.roast}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default AllProductsPage;

