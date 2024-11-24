import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/Admin_Assets/upload_area.svg';

const AddProduct = () => {
    const [images, setImages] = useState([]);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "basketballs",
        new_price: "",
        old_price: "",
        size: "",
        brand: "" 
    });

    const imageHandler = (e) => {
        const files = e.target.files; 
        const uploadedImages = [...images];

       
        for (let i = 0; i < files.length; i++) {
            uploadedImages.push(files[i]);
        }

        setImages(uploadedImages);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const Add_Product = async () => {
        try {
          // Lưu size dưới dạng chuỗi
          let product = { ...productDetails };
          product.size = product.size.trim();
      
          // Chuyển tất cả ảnh thành FormData
          let formData = new FormData();
          images.forEach((image) => {
            formData.append('product_images', image, image.name);
          });
      
          // Tải ảnh lên server
          const uploadResponse = await fetch('http://192.168.55.106:4000/upload', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: formData,
          }).then((resp) => resp.json());
      
          if (uploadResponse.success) {
            // Cập nhật URL ảnh vào product
            product.image_urls = uploadResponse.image_urls;
      
            // Gửi yêu cầu thêm sản phẩm
            const addResponse = await fetch('http://192.168.55.106:4000/addproduct', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(product),
            }).then((resp) => resp.json());
      
            if (addResponse.success) {
              alert('Product Added');
              setImages([]); // Reset state images
            } else {
              alert('Failed to add product');
            }
          } else {
            alert('Failed to upload images');
          }
        } catch (error) {
          console.error('Error adding product:', error);
        }
      };
    
    
    

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="shoes">Shoes</option>
                    <option value="basketballs">Basketballs</option>
                    <option value="accessories">Accessories</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Brand</p>
                <input value={productDetails.brand} onChange={changeHandler} type="text" name="brand" placeholder="Enter brand name" />
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={images.length > 0 ? URL.createObjectURL(images[images.length - 1]) : upload_area} className='addproduct-thumbnail-img' />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' multiple hidden />
            </div>

            <div className="image-preview">
                <h4>Uploaded Images:</h4>
                <ul>
                    {images.map((image, index) => (
                        <li key={index}>
                            <img className="preview-img" src={URL.createObjectURL(image)} alt={`uploaded-${index}`} />
                        </li>
                    ))}
                </ul>
            </div>

            <div className="addproduct-itemfield">
                <p>Product Sizes</p>
                <input
                    value={productDetails.size}
                    onChange={changeHandler}
                    type="text"
                    name="size"
                    placeholder="Enter sizes separated by commas (e.g. 8, 8.5, 9)"
                />
            </div>



            <button onClick={() => { Add_Product() }} className='addproduct-btn'>ADD</button>
        </div>
    );
};

export default AddProduct;
