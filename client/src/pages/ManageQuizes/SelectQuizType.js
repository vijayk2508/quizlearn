import React, { useState, useEffect } from 'react';
import axiosInstance from '../../service';
import { Form } from '@themesberg/react-bootstrap';

function SelectQuizType({ onChange, value , fromGroupClassName}) {
  const [quizTypes, setQuizTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizTypes = async () => {
      try {
        const response = await axiosInstance.get('/quiztype');
        setQuizTypes(response.data.quizTypes);
        setLoading(false);
      } catch (error) {
        setError('Error fetching quiztypes. Please try again.');
        setLoading(false);
      }
    };

    fetchQuizTypes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <Form.Group controlId="selectQuizType" className={fromGroupClassName}>
      <Form.Label>Quiz Name</Form.Label>
      <Form.Control as="select" onChange={onChange} value={value}>
        <option value="">Select a quiz name</option>
        {quizTypes.map((quiztype) => (
          <option key={quiztype._id} value={quiztype._id}>
            {quiztype.name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}

export default SelectQuizType;