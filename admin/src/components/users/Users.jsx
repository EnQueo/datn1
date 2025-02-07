import React, { useState, useEffect } from 'react';
import './Users.css'; 

const Users = () => {
  const [users, setUsers] = useState([]);  

  const fetchUsers = async () => {
    try {
      const response = await fetch('/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('User deleted successfully.');
        fetchUsers();
      } else {
        alert('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user">
      <div className="user-format-main">
        <p>Id</p>
        <p>Name</p>
        <p>Email</p>
        <p>Role</p>
        <p>Actions</p>
      </div>
      <div className="user-alluser">
        <hr />
        {users.map((user, index) => (
          <div key={index} className="user-format">
            <p>{user.id}</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <button 
              className="delete-btn" 
              onClick={() => deleteUser(user.id)}>
              Delete
            </button>
          </div>
        ))}
        <hr />
      </div>
    </div>
  );
};

export default Users;
