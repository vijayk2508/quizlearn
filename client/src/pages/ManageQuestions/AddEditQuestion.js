import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Modal,
  Spinner,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "@themesberg/react-bootstrap";
import DOMPurify from "dompurify";
import axiosInstance from "../../service";
import SelectCategory from "./SelectCategory";
import SelectQuizType from "./SelectQuizType";
import SelectQuestionType from "./SelectQuestionType";
import questionTypeData from "../../data/questiontypedata";
import { FaLink, FaUpload } from "react-icons/fa";

function AddEditQuestion({
  showModal = false,
  setShowModal = () => {},
  id = null,
  handleRefresh = () => {},
}) {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [category, setCategory] = useState("");
  const [quizType, setQuizType] = useState("");
  const [optionType, setOptionType] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [option1Error, setOption1Error] = useState("");
  const [option2Error, setOption2Error] = useState("");
  const [option3Error, setOption3Error] = useState("");
  const [option4Error, setOption4Error] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [thumbnail1, setThumbnail1] = useState("");
  const [thumbnailFile1, setThumbnailFile1] = useState(null);
  const [thumbnailError1, setThumbnailError1] = useState("");
  const [isValidUrl1, setIsValidUrl1] = useState(false);
  const [thumbnail2, setThumbnail2] = useState("");
  const [thumbnailFile2, setThumbnailFile2] = useState(null);
  const [thumbnailError2, setThumbnailError2] = useState("");
  const [isValidUrl2, setIsValidUrl2] = useState(false);
  const [thumbnail3, setThumbnail3] = useState("");
  const [thumbnailFile3, setThumbnailFile3] = useState(null);
  const [thumbnailError3, setThumbnailError3] = useState("");
  const [isValidUrl3, setIsValidUrl3] = useState(false);
  const [thumbnail4, setThumbnail4] = useState("");
  const [thumbnailFile4, setThumbnailFile4] = useState(null);
  const [thumbnailError4, setThumbnailError4] = useState("");
  const [isValidUrl4, setIsValidUrl4] = useState(false);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const fileInputRef4 = useRef(null);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleThumbnailChange1 = (e) => {
    const value = e.target.value;
    setThumbnail1(value);
    setIsValidUrl1(value.match(/(https?:\/\/.*\.(?:png|jpg))/i));
  };

  const handleThumbnailChange2 = (e) => {
    const value = e.target.value;
    setThumbnail2(value);
    setIsValidUrl2(value.match(/(https?:\/\/.*\.(?:png|jpg))/i));
  };

  const handleThumbnailChange3 = (e) => {
    const value = e.target.value;
    setThumbnail3(value);
    setIsValidUrl3(value.match(/(https?:\/\/.*\.(?:png|jpg))/i));
  };

  const handleThumbnailChange4 = (e) => {
    const value = e.target.value;
    setThumbnail4(value);
    setIsValidUrl4(value.match(/(https?:\/\/.*\.(?:png|jpg))/i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate options
    if (!option1) setOption1Error("Option 1 is required");
    if (!option2) setOption2Error("Option 2 is required");
    if (optionType !== "trueFalse") {
      if (!option3) setOption3Error("Option 3 is required");
      if (!option4) setOption4Error("Option 4 is required");
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append("questionType", questionType);
    formData.append("category", category);
    formData.append("quizType", quizType);
    formData.append("optionType", optionType);
    formData.append("questionTitle", questionTitle);

    // Add thumbnail files if available
    if (thumbnailFile1) {
      formData.append("thumbnailFile1", thumbnailFile1);
    } else {
      formData.append("thumbnail1", thumbnail1);
    }

    if (thumbnailFile2) {
      formData.append("thumbnailFile2", thumbnailFile2);
    } else {
      formData.append("thumbnail2", thumbnail2);
    }

    if (thumbnailFile3) {
      formData.append("thumbnailFile3", thumbnailFile3);
    } else {
      formData.append("thumbnail3", thumbnail3);
    }

    if (thumbnailFile4) {
      formData.append("thumbnailFile4", thumbnailFile4);
    } else {
      formData.append("thumbnail4", thumbnail4);
    }

    // Add options based on optionType
    formData.append("option1", option1);
    formData.append("option2", option2);
    if (optionType !== "trueFalse") {
      formData.append("option3", option3);
      formData.append("option4", option4);
    }

    try {
      // Submit the form data
      const response = await axiosInstance.post("/api/questions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
        handleRefresh();
        setShowModal(false);
      } else {
        setResponseError("Failed to submit the question.");
      }
    } catch (error) {
      setResponseError("An error occurred while submitting the question.");
    } finally {
      setLoading(false);
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
        size="lg"
      >
        <Modal.Header>
          <Modal.Title className="h6">
            {id ? "Edit" : "Add"} Question
          </Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={handleClose}
            disabled={loading}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <SelectCategory
                  fromGroupClassName="mb-3"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <SelectQuizType
                  fromGroupClassName="mb-3"
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value)}
                />
              </Col>
            </Row>

            <SelectQuestionType
              fromGroupClassName="mb-3"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            />

            <Form.Group className="mb-3">
              <Form.Label>Question Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Question Title"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Option Type</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Text Only"
                  type="radio"
                  name="optionType"
                  id="textOnly"
                  value="textOnly"
                  checked={optionType === "textOnly"}
                  onChange={(e) => setOptionType(e.target.value)}
                />
                <Form.Check
                  inline
                  label="True/False"
                  type="radio"
                  name="optionType"
                  id="trueFalse"
                  value="trueFalse"
                  checked={optionType === "trueFalse"}
                  onChange={(e) => setOptionType(e.target.value)}
                />
                <Form.Check
                  inline
                  label="Images"
                  type="radio"
                  name="optionType"
                  id="images"
                  value="images"
                  checked={optionType === "images"}
                  onChange={(e) => setOptionType(e.target.value)}
                />
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Option 1</Form.Label>
                  {optionType === "images" ? (
                    <>
                      <InputGroup>
                        <InputGroup.Text>
                          {thumbnailFile1 ? <FaUpload /> : <FaLink />}
                        </InputGroup.Text>
                        <FormControl
                          type="text"
                          placeholder="Enter image URL or select a file"
                          value={thumbnail1}
                          onChange={handleThumbnailChange1}
                          disabled={thumbnailFile1 !== null || loading}
                          isInvalid={thumbnailError1 !== ""}
                        />
                        <FormControl
                          type="file"
                          onChange={(e) =>
                            setThumbnailFile1(e?.target?.files?.[0])
                          }
                          style={{ display: "none" }}
                          ref={fileInputRef1}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => fileInputRef1.current.click()}
                          disabled={thumbnail1 !== "" || loading}
                        >
                          {thumbnailFile1 ? "Change File" : "Upload File"}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {thumbnailError1}
                        </Form.Control.Feedback>
                      </InputGroup>
                      {isValidUrl1 && thumbnail1 && (
                        <div className="mt-3">
                          <img
                            src={thumbnail1}
                            alt="Thumbnail Preview"
                            style={{ maxWidth: "100%", maxHeight: "100px" }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <Form.Control
                      type="text"
                      placeholder="Enter Option 1"
                      value={option1}
                      onChange={(e) => setOption1(e.target.value)}
                      isInvalid={option1Error !== ""}
                    />
                  )}
                  <Form.Control.Feedback type="invalid">
                    {option1Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Option 2</Form.Label>
                  {optionType === "images" ? (
                    <>
                      <InputGroup>
                        <InputGroup.Text>
                          {thumbnailFile2 ? <FaUpload /> : <FaLink />}
                        </InputGroup.Text>
                        <FormControl
                          type="text"
                          placeholder="Enter image URL or select a file"
                          value={thumbnail2}
                          onChange={handleThumbnailChange2}
                          disabled={thumbnailFile2 !== null || loading}
                          isInvalid={thumbnailError2 !== ""}
                        />
                        <FormControl
                          type="file"
                          onChange={(e) =>
                            setThumbnailFile2(e?.target?.files?.[0])
                          }
                          style={{ display: "none" }}
                          ref={fileInputRef2}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => fileInputRef2.current.click()}
                          disabled={thumbnail2 !== "" || loading}
                        >
                          {thumbnailFile2 ? "Change File" : "Upload File"}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {thumbnailError2}
                        </Form.Control.Feedback>
                      </InputGroup>
                      {isValidUrl2 && thumbnail2 && (
                        <div className="mt-3">
                          <img
                            src={thumbnail2}
                            alt="Thumbnail Preview"
                            style={{ maxWidth: "100%", maxHeight: "100px" }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <Form.Control
                      type="text"
                      placeholder="Enter Option 2"
                      value={option2}
                      onChange={(e) => setOption2(e.target.value)}
                      isInvalid={option2Error !== ""}
                    />
                  )}
                  <Form.Control.Feedback type="invalid">
                    {option2Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            {optionType !== "trueFalse" && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Option 3</Form.Label>
                      {optionType === "images" ? (
                        <>
                          <InputGroup>
                            <InputGroup.Text>
                              {thumbnailFile3 ? <FaUpload /> : <FaLink />}
                            </InputGroup.Text>
                            <FormControl
                              type="text"
                              placeholder="Enter image URL or select a file"
                              value={thumbnail3}
                              onChange={handleThumbnailChange3}
                              disabled={thumbnailFile3 !== null || loading}
                              isInvalid={thumbnailError3 !== ""}
                            />
                            <FormControl
                              type="file"
                              onChange={(e) =>
                                setThumbnailFile3(e?.target?.files?.[0])
                              }
                              style={{ display: "none" }}
                              ref={fileInputRef3}
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => fileInputRef3.current.click()}
                              disabled={thumbnail3 !== "" || loading}
                            >
                              {thumbnailFile3 ? "Change File" : "Upload File"}
                            </Button>
                            <Form.Control.Feedback type="invalid">
                              {thumbnailError3}
                            </Form.Control.Feedback>
                          </InputGroup>
                          {isValidUrl3 && thumbnail3 && (
                            <div className="mt-3">
                              <img
                                src={thumbnail3}
                                alt="Thumbnail Preview"
                                style={{ maxWidth: "100%", maxHeight: "100px" }}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <Form.Control
                          type="text"
                          placeholder="Enter Option 3"
                          value={option3}
                          onChange={(e) => setOption3(e.target.value)}
                          isInvalid={option3Error !== ""}
                        />
                      )}
                      <Form.Control.Feedback type="invalid">
                        {option3Error}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Option 4</Form.Label>
                      {optionType === "images" ? (
                        <>
                          <InputGroup>
                            <InputGroup.Text>
                              {thumbnailFile4 ? <FaUpload /> : <FaLink />}
                            </InputGroup.Text>
                            <FormControl
                              type="text"
                              placeholder="Enter image URL or select a file"
                              value={thumbnail4}
                              onChange={handleThumbnailChange4}
                              disabled={thumbnailFile4 !== null || loading}
                              isInvalid={thumbnailError4 !== ""}
                            />
                            <FormControl
                              type="file"
                              onChange={(e) =>
                                setThumbnailFile4(e?.target?.files?.[0])
                              }
                              style={{ display: "none" }}
                              ref={fileInputRef4}
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => fileInputRef4.current.click()}
                              disabled={thumbnail4 !== "" || loading}
                            >
                              {thumbnailFile4 ? "Change File" : "Upload File"}
                            </Button>
                            <Form.Control.Feedback type="invalid">
                              {thumbnailError4}
                            </Form.Control.Feedback>
                          </InputGroup>
                          {isValidUrl4 && thumbnail4 && (
                            <div className="mt-3">
                              <img
                                src={thumbnail4}
                                alt="Thumbnail Preview"
                                style={{ maxWidth: "100%", maxHeight: "100px" }}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <Form.Control
                          type="text"
                          placeholder="Enter Option 4"
                          value={option4}
                          onChange={(e) => setOption4(e.target.value)}
                          isInvalid={option4Error !== ""}
                        />
                      )}
                      <Form.Control.Feedback type="invalid">
                        {option4Error}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

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

export default AddEditQuestion;