import React, { useContext, useState } from 'react';
import './css/ShopCategory.css';
import { ShopContext } from '../context/ShopContext';
import dropdown_icon from '../components/assets/Frontend_Assets/dropdown_icon.png';
import Item from '../components/item/Item';
import Footer from '../components/fotter/Footer';
import defaultImage from '../components/assets/Frontend_Assets/luka1.jpg';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOrder, setSortOrder] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(12); // State để quản lý số lượng sản phẩm hiển thị

  const brandOptions = {
    shoes: ['Nike', 'Adidas', 'Puma', 'Under Armour','Anta'],
    basketballs: ['Gerustar', 'Prostar'],
  };

  const filteredProducts = all_product
    .filter((item) => {
      const matchesCategory = props.category === item.category;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(item.brand);
      const matchesPrice = item.new_price >= priceRange[0] && item.new_price <= priceRange[1];
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesBrand && matchesPrice && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.new_price - b.new_price;
      if (sortOrder === 'desc') return b.new_price - a.new_price;
      return 0;
    });

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => (name === 'min' ? [Number(value), prev[1]] : [prev[0], Number(value)]));
  };

  const handleSortClick = (order) => {
    setSortOrder(order);
    setIsDropdownOpen(false);
  };

  const handleExploreMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 12, filteredProducts.length));
  };

  return (
    <div className="shop-category">
      <div className="shopcategory-sidebar">
        <div className="shopcategory-sidebar-section">
          <h4>Brand</h4>
          {brandOptions[props.category]?.map((brand) => (
            <div key={brand} className="shopcategory-sidebar-brand">
              <input
                type="checkbox"
                id={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
              <label htmlFor={brand}>{brand}</label>
            </div>
          ))}
        </div>

        <div className="shopcategory-sidebar-section">
          <h4>Price Range</h4>
          <div className="shopcategory-sidebar-price">
            <label>
              Min:
              <input
                type="number"
                name="min"
                value={priceRange[0]}
                onChange={handlePriceChange}
              />
            </label>
            <label>
              Max:
              <input
                type="number"
                name="max"
                value={priceRange[1]}
                onChange={handlePriceChange}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="shopcategory-main">
        <div className="shopcategory-indexSort">
          <p>
            <span>Showing {Math.min(visibleProducts, filteredProducts.length)} out of {filteredProducts.length}</span>
          </p>

          <div className="shopcategory-sort">
            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              Sort by <img src={dropdown_icon} alt="" />
            </div>
            {isDropdownOpen && (
              <ul className="shopcategory-sort-dropdown">
                <li onClick={() => handleSortClick('asc')}>
                  Sort by price <span>▲</span>
                </li>
                <li onClick={() => handleSortClick('desc')}>
                  Sort by price <span>▼</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="shopcategory-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products..."
            className="shopcategory-searchbar"
          />
        </div>

        <div className="shopcategory-products">
          {filteredProducts.slice(0, visibleProducts).map((item, i) => {
            const productImage = item.image || defaultImage;  // Thay đổi từ 'images' thành 'image'

            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={productImage} // Truyền ảnh đúng từ trường 'image'
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          })}
        </div>

        {filteredProducts.length > visibleProducts && (
          <div className="shopcategory-loadmore" onClick={handleExploreMore}>
            Explore More
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default ShopCategory;
