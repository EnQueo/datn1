import React, { useEffect, useState } from 'react';
import './Coupon.css';

const Coupon = () => {
  const [promos, setPromos] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [currentPromo, setCurrentPromo] = useState({
    code: '',
    discount_percentage: '',
    expire_date: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Lấy danh sách promo từ API
  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const response = await fetch('/promos');
      const data = await response.json();
      setPromos(data);
    } catch (error) {
      console.error('Error fetching promos:', error);
    }
  };

  // Xử lý thay đổi form
  const handleChange = (e) => {
    setCurrentPromo({ ...currentPromo, [e.target.name]: e.target.value });
  };

  // Thêm/Sửa Promo
  const handleSubmit = async () => {
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing ? `/promos/${currentPromo._id}` : '/promos';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPromo),
      });

      if (response.ok) {
        alert(`${isEditing ? 'Updated' : 'Added'} Promo Code Successfully`);
        closeForm();
        fetchPromos();
      } else {
        alert('Error submitting promo data');
      }
    } catch (error) {
      console.error('Error submitting promo:', error);
      alert('An error occurred');
    }
  };

  // Xóa Promo
  const handleDelete = async (id) => {
    try {
      await fetch(`/promos/${id}`, { method: 'DELETE' });
      alert('Promo Deleted Successfully');
      fetchPromos();
    } catch (error) {
      console.error('Error deleting promo:', error);
      alert('An error occurred while deleting promo');
    }
  };

  // Hiển thị form sửa
  const handleEdit = (promo) => {
    setCurrentPromo(promo);
    setFormVisible(true);
    setIsEditing(true);
  };

  // Hiển thị form thêm
  const handleAddPromo = () => {
    setCurrentPromo({ code: '', discount_percentage: '', expire_date: '' });
    setFormVisible(true);
    setIsEditing(false);
  };

  // Đóng form
  const closeForm = () => {
    setFormVisible(false);
    setCurrentPromo({ code: '', discount_percentage: '', expire_date: '' });
  };

  return (
    <div className="promo-container">
      <div className="promo-header">
        <h1>Promo Management</h1>
        <button className="add-promo-btn" onClick={handleAddPromo}>Add Promo</button>
      </div>

      {/* Bảng danh sách promo */}
      <table className="promo-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount (%)</th>
            <th>Expire Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promos.map((promo) => (
            <tr key={promo._id}>
              <td>{promo.code}</td>
              <td>{promo.discount_percentage}</td>
              <td>{new Date(promo.expire_date).toLocaleDateString()}</td>
              <td className="promo-actions">
                <button className="edit-btn" onClick={() => handleEdit(promo)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(promo._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup form thêm/sửa promo */}
      {isFormVisible && (
        <div className="promo-popup-overlay">
          <div className="promo-popup">
            <button className="close-btn" onClick={closeForm}>×</button>
            <h1>{isEditing ? 'Edit Promo' : 'Add Promo'}</h1>
            <div className="addpromo-itemfield">
              <p>Promo Code</p>
              <input
                value={currentPromo.code}
                onChange={handleChange}
                type="text"
                name="code"
                placeholder="Enter promo code"
              />
            </div>
            <div className="addpromo-itemfield">
              <p>Discount Percentage</p>
              <input
                value={currentPromo.discount_percentage}
                onChange={handleChange}
                type="number"
                name="discount_percentage"
                placeholder="Enter discount percentage"
              />
            </div>
            <div className="addpromo-itemfield">
              <p>Expire Date</p>
              <input
                value={currentPromo.expire_date}
                onChange={handleChange}
                type="date"
                name="expire_date"
              />
            </div>
            <button onClick={handleSubmit} className="addpromo-btn">
              {isEditing ? 'Update Promo' : 'Add Promo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupon;
