import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/Admin_Assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newSize, setNewSize] = useState('');
  const [newQuantity, setNewQuantity] = useState(0);
  const [isAddingNewSize, setIsAddingNewSize] = useState(false);

  const fetchInfo = async () => {
    await fetch('/allproducts')
      .then((res) => res.json())
      .then((data) => { setAllProducts(data) });
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  const remove_product = async (id) => {
    await fetch('/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id })
    });

    await fetchInfo();
  }

  const openPopup = (product) => {
    setCurrentProduct(product);
    setIsPopupOpen(true);
    setIsAddingNewSize(false);
  }

  const closePopup = () => {
    setIsPopupOpen(false);
    setNewSize('');
    setNewQuantity(0);
    setIsAddingNewSize(false);
  }

  const addOrUpdateSize = async () => {
    const updatedProduct = { ...currentProduct };
    const existingSizeIndex = updatedProduct.sizes.findIndex(s => s.size === newSize);

    if (existingSizeIndex !== -1) {
      updatedProduct.sizes[existingSizeIndex].quantity += newQuantity;
    } else {
      updatedProduct.sizes.push({ size: newSize, quantity: newQuantity }); 
    }

    await fetch('/updateproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: currentProduct.id, sizes: updatedProduct.sizes })
    });

    await fetchInfo();
    closePopup();
  }

  const handleSizeChange = (e, size) => {
    const updatedProduct = { ...currentProduct };
    const sizeIndex = updatedProduct.sizes.findIndex(s => s.size === size.size);
    
    if (sizeIndex !== -1) {
      updatedProduct.sizes[sizeIndex].quantity = parseInt(e.target.value) || 0;
    }

    setCurrentProduct(updatedProduct);
  }

  return (
    <div className='list-product'>
      <div className="listproduct-format-main">
        <p>Name</p>
        <p>New Price</p>
        <p>Sizes</p>
        <p>Action</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product, index) => {
          return (
            <div key={index} className="listproduct-format">
              <p>{product.name}</p>
              <p>${product.new_price}</p>
              <div className="size-container">
                {product.sizes.map((sizeItem, index) => (
                  <span key={index}>{sizeItem.size}: {sizeItem.quantity}{index < product.sizes.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
              <div>
                <button onClick={() => openPopup(product)}>Edit</button>
                <img onClick={() => { remove_product(product.id) }} src={cross_icon} className='listproduct-delete-icon' alt="" />
              </div>
            </div>
          )
        })}
      </div>

      {isPopupOpen && currentProduct && (
        <div className={`popup ${isPopupOpen ? 'popup-show' : ''}`}>
          <div className="popup-content">
            <h3>Edit Product - {currentProduct.name}</h3>

            <div className="size-list">
              {currentProduct.sizes.map((sizeItem, index) => (
                <div key={index} className="size-input-container">
                  <label>{sizeItem.size}: </label>
                  <input 
                    type="number" 
                    value={sizeItem.quantity || 0}
                    onChange={(e) => handleSizeChange(e, sizeItem)} 
                    min="0" 
                  />
                </div>
              ))}
            </div>

            {isAddingNewSize && (
              <div className="size-inputs">
                <div>
                  <label>New Size: </label>
                  <input 
                    type="text" 
                    value={newSize} 
                    onChange={(e) => setNewSize(e.target.value)} 
                    placeholder="Enter size" 
                  />
                </div>
                <div>
                  <label>Quantity: </label>
                  <input 
                    type="number" 
                    value={newQuantity} 
                    onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)} 
                    placeholder="Enter quantity" 
                  />
                </div>
              </div>
            )}

            <button onClick={() => setIsAddingNewSize(true)}>Add New Size</button>
            <button onClick={addOrUpdateSize}>Add/Update Size</button>
            <button className="close-button" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListProduct;
