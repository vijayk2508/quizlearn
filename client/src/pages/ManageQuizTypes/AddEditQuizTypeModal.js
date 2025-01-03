import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Modal,
  Spinner,
} from "@themesberg/react-bootstrap";
import DOMPurify from "dompurify";
import axiosInstance from "../../service";

function AddEditQuizTypeModal({
  showModal = false,
  setShowModal = () => {},
  id = null,
  handleRefresh = () => {},
}) {
  const [quizTypeName, setQuizTypeName] = useState("");
  const [isQuizTypeNameValid, setIsQuizTypeNameValid] = useState(true);
  const [quizTypeNameError, setQuizTypeNameError] = useState("");
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchQuizType = async () => {
        try {
          const response = await axiosInstance.get(`/quiztype/${id}`);
          const quizType = response.data;
          setQuizTypeName(quizType.name);
        } catch (error) {
          console.error("Error fetching quiz type:", error);
          setResponseError("Error fetching quiz type. Please try again.");
        }
      };

      fetchQuizType();
    }
  }, [id]);

  const handleClose = () => {
    setShowModal(false);
    setQuizTypeName("");
    setIsQuizTypeNameValid(true);
    setQuizTypeNameError("");
    setResponseError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const sanitizedQuizTypeName = DOMPurify.sanitize(quizTypeName.trim());
    const isValidQuizTypeName = /^[a-zA-Z0-9\s]+$/.test(sanitizedQuizTypeName);

    if (!sanitizedQuizTypeName || !isValidQuizTypeName) {
      setIsQuizTypeNameValid(false);
      setQuizTypeNameError("Quiz type name is required and should be valid.");
      setLoading(false);
      return;
    } else {
      setIsQuizTypeNameValid(true);
      setQuizTypeNameError("");
    }

    const formData = { name: sanitizedQuizTypeName };

    try {
      let response;
      if (id) {
        response = await axiosInstance.put(`/quiztype/${id}`, formData);
        console.log("Quiz type updated successfully:", response.data);
      } else {
        response = await axiosInstance.post("/quiztype", formData);
        console.log("Quiz type added successfully:", response.data);
      }
      setLoading(false);
      setShowSuccessModal(true);
      handleClose();
      handleRefresh(); // Trigger refresh in parent component
    } catch (error) {
      console.error("Error saving quiz type:", error);
      setResponseError("Error saving quiz type. Please try again.");
      setLoading(false);
    }
  };

  const handleQuizTypeNameChange = (e) => {
    const name = e.target.value;
    setQuizTypeName(name);
    const sanitizedQuizTypeName = DOMPurify.sanitize(name.trim());
    const isValidQuizTypeName = /^[a-zA-Z0-9\s]+$/.test(sanitizedQuizTypeName);

    if (!sanitizedQuizTypeName || !isValidQuizTypeName) {
      setIsQuizTypeNameValid(false);
      setQuizTypeNameError("Quiz type name is required and should be valid.");
    } else {
      setIsQuizTypeNameValid(true);
      setQuizTypeNameError("");
    }
  };

  return (
    <>
      <Modal
        as={Modal.Dialog}
        centered
        show={showModal}
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title className="h6">{id ? "Edit" : "Add"} Quiz Type</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={handleClose}
            disabled={loading}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Quiz Type Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter quiz type name"
                value={quizTypeName}
                onChange={handleQuizTypeNameChange}
                isInvalid={!isQuizTypeNameValid}
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                {quizTypeNameError}
              </Form.Control.Feedback>
            </Form.Group>
            {responseError && (
              <div className="text-danger mb-3">{responseError}</div>
            )}
            <Modal.Footer>
              <Button variant="secondary" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
              </Button>
              <Button
                variant="link"
                className="text-gray ms-auto"
                onClick={handleClose}
                disabled={loading}
              >
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        centered
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
      >
        <Modal.Header>
          <Modal.Title className="h6">Success</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={() => setShowSuccessModal(false)}
          />
        </Modal.Header>
        <Modal.Body>
          <p>Quiz type {id ? "updated" : "added"} successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddEditQuizTypeModal;