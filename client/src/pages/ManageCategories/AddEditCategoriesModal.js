import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Button,
  Modal,
  InputGroup,
  FormControl,
  Spinner,
} from "@themesberg/react-bootstrap";
import { FaUpload, FaLink } from "react-icons/fa";
import DOMPurify from "dompurify";
import axiosInstance from "../../service";

function AddEditCategoriesModal({
  showModal = false,
  setShowModal = () => {},
  categoryId = null,
  handleRefresh = () => {},
}) {
  const [categoryName, setCategoryName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isCategoryNameValid, setIsCategoryNameValid] = useState(true);
  const [categoryNameError, setCategoryNameError] = useState("");
  const [thumbnailError, setThumbnailError] = useState("");
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (categoryId) {
      const fetchCategory = async () => {
        try {
          const response = await axiosInstance.get(`/categories/${categoryId}`);
          const category = response.data;
          setCategoryName(category.name);
          setThumbnail(category.thumbnailImage);
        } catch (error) {
          console.error("Error fetching category:", error);
          setResponseError("Error fetching category. Please try again.");
        }
      };

      fetchCategory();
    }
  }, [categoryId]);

  const handleClose = () => {
    setShowModal(false);
    setCategoryName("");
    setThumbnail("");
    setThumbnailFile(null);
    setIsValidUrl(true);
    setIsCategoryNameValid(true);
    setCategoryNameError("");
    setThumbnailError("");
    setResponseError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const sanitizedCategoryName = DOMPurify.sanitize(categoryName.trim());
    const isValidCategoryName = /^[a-zA-Z0-9\s]+$/.test(sanitizedCategoryName);

    if (!sanitizedCategoryName || !isValidCategoryName) {
      setIsCategoryNameValid(false);
      setCategoryNameError("Category name is required and should be valid.");
      setLoading(false);
      return;
    } else {
      setIsCategoryNameValid(true);
      setCategoryNameError("");
    }

    if (!thumbnailFile && (!isValidUrl || !thumbnail.trim())) {
      setThumbnailError("Please provide a valid URL or upload an image.");
      setLoading(false);
      return;
    } else {
      setThumbnailError("");
    }

    const formData = new FormData();
    formData.append("name", sanitizedCategoryName);
    if (thumbnailFile) {
      formData.append("thumbnailImage", thumbnailFile);
    } else if (isValidUrl) {
      formData.append("thumbnailImage", thumbnail);
    }

    try {
      let response;
      if (categoryId) {
        response = await axiosInstance.put(`/categories/${categoryId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Category updated successfully:", response.data);
      } else {
        response = await axiosInstance.post("/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Category added successfully:", response.data);
      }
      setLoading(false);
      setShowSuccessModal(true);
      handleClose();
      handleRefresh(); // Trigger refresh in parent component
    } catch (error) {
      console.error("Error saving category:", error);
      setResponseError("Error saving category. Please try again.");
      setLoading(false);
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleCategoryNameChange = (e) => {
    const name = e.target.value;
    setCategoryName(name);
    const sanitizedCategoryName = DOMPurify.sanitize(name.trim());
    const isValidCategoryName = /^[a-zA-Z0-9\s]+$/.test(sanitizedCategoryName);

    if (!sanitizedCategoryName || !isValidCategoryName) {
      setIsCategoryNameValid(false);
      setCategoryNameError("Category name is required and should be valid.");
    } else {
      setIsCategoryNameValid(true);
      setCategoryNameError("");
    }
  };

  const handleThumbnailChange = (e) => {
    const url = e.target.value;
    setThumbnail(url);
    const validUrl = validateUrl(url);
    setIsValidUrl(validUrl);
    if (!validUrl) {
      setThumbnailError("Please provide a valid URL.");
    } else {
      setThumbnailError("");
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
          <Modal.Title className="h6">{categoryId ? "Edit" : "Add"} Category</Modal.Title>
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
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={handleCategoryNameChange}
                isInvalid={!isCategoryNameValid}
                disabled={loading}
              />
              <Form.Control.Feedback type="invalid">
                {categoryNameError}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category Thumbnail Image</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  {thumbnailFile ? <FaUpload /> : <FaLink />}
                </InputGroup.Text>
                <FormControl
                  type="text"
                  placeholder="Enter image URL or select a file"
                  value={thumbnail}
                  onChange={handleThumbnailChange}
                  disabled={thumbnailFile !== null || loading}
                  isInvalid={thumbnailError !== ""}
                />
                <FormControl
                  type="file"
                  onChange={(e) => setThumbnailFile(e?.target?.files?.[0])}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => fileInputRef.current.click()}
                  disabled={thumbnail !== "" || loading}
                >
                  {thumbnailFile ? "Change File" : "Upload File"}
                </Button>
                <Form.Control.Feedback type="invalid">
                  {thumbnailError}
                </Form.Control.Feedback>
              </InputGroup>
              {isValidUrl && thumbnail && (
                <div className="mt-3">
                  <img
                    src={thumbnail}
                    alt="Thumbnail Preview"
                    style={{ maxWidth: "100%", maxHeight: "100px" }}
                  />
                </div>
              )}
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
          <p>Category {categoryId ? "updated" : "added"} successfully!</p>
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

export default AddEditCategoriesModal;