import React, { useState, useEffect } from 'react';
import './css/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState({
    email: '',
    name: '',  // Chuyển từ 'username' thành 'name'
    avatar: '', // Avatar mặc định
  });
  const [newName, setNewName] = useState(''); // Chuyển từ 'newUsername' thành 'newName'
  const [newAvatar, setNewAvatar] = useState(null);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Lấy dữ liệu người dùng khi trang được tải
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('http://192.168.55.106:4000/user-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json();
        setUser({
          email: data.email,
          name: data.name,
          avatar: data.avatar,
        });
        
      } else {
        console.error("Error fetching user data", response.status);
      }
    };
  
    fetchUserData();
  }, []);
  
  // Xử lý thay đổi avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
    }
  };

  // Lưu thay đổi thông tin người dùng
  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('name', newName);  // Sửa từ 'username' thành 'name'
    if (newAvatar) {
      formData.append('avatar', newAvatar);
    }

    const response = await fetch('http://192.168.55.106:4000/user-profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      alert('Changes saved successfully!');
      setUser({
        ...user,
        name: newName,  // Cập nhật 'name' thay vì 'username'
        avatar: data.avatar || user.avatar, // Cập nhật avatar nếu có
      });
      setIsEditing(false);
    } else {
      alert('Failed to save changes!');
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    const response = await fetch('http://192.168.55.106:4000/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldPassword: password,
        newPassword,
      }),
    });

    const data = await response.json();
    if (data.success) {
      alert('Password changed successfully!');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    } else {
      setPasswordError(data.message || 'Failed to change password');
    }
  };

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <div className="profile-section">
        <div className="avatar" onClick={() => document.getElementById('avatar-upload').click()}>
          <img
            src={user.avatar || 'https://via.placeholder.com/150'}
            alt="User Avatar"
            className="avatar-img"
          />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="avatar-upload"
          />
        </div>
        <div className="user-info">
          <div className="info">
            <label>Email:</label>
            <p>{user.email}</p>
          </div>
          <div className="info">
            <label>Name:</label>
            <div className="save-change-section">
              {isEditing ? (
                <input
                  type="text"
                  value={newName}  
                  onChange={(e) => setNewName(e.target.value)}  
                />
              ) : (
                <p>{user.name}</p>
              )}
              <span
                className="edit-icon"
                onClick={() => {
                  if (isEditing) {
                    setNewName(user.name);  // Sửa từ 'username' thành 'name'
                    setIsEditing(false);
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? '✖' : '✏️'}
              </span>
              {isEditing && <button onClick={handleSaveChanges}>Save Changes</button>}
            </div>
          </div>
        </div>
      </div>

      <div className="change-password-section">
        <h3>Change Password</h3>
        {passwordError && <p className="error">{passwordError}</p>}
        <div className="info">
          <label>Current Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="info">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="info">
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="info">
          <button onClick={handleChangePassword}>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
