import React, { useState, useEffect } from 'react';
import axiosInstance from '../../service';
import { Form } from '@themesberg/react-bootstrap';

function SelectCategory({ onChange, value, fromGroupClassName }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        setCategories(response.data.categories);
        setLoading(false);
      } catch (error) {
        setError('Error fetching categories. Please try again.');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <Form.Group controlId="selectCategory" className={fromGroupClassName}>
      <Form.Label>Category</Form.Label>
      <Form.Control as="select" onChange={onChange} value={value}>
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}

export default SelectCategory;