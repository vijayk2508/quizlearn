import React, { useState, useRef, useEffect } from "react";
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
import axiosInstance from "../../service";
import SelectCategory from "./SelectCategory";
import SelectQuizType from "./SelectQuizType";
import SelectQuestionType from "./SelectQuestionType";
import { FaLink, FaUpload } from "react-icons/fa";
import questionTypeData from "../../data/questiontypedata";

function AddEditQuiz({
  showModal = false,
  setShowModal = () => {},
  id = null,
  handleRefresh = () => {},
}) {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [questionType, setQuestionType] = useState(
    questionTypeData.text_only.value
  );
  const [category, setCategory] = useState("");
  const [quizType, setQuizType] = useState("");
  const [optionType, setOptionType] = useState("textOnly");
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
  const [correctOption, setCorrectOption] = useState("");
  const [correctOptionError, setCorrectOptionError] = useState("");
  const [optionMapping, setOptionMapping] = useState(null);


  useEffect(() => {
    if (id) {
      // Fetch quiz data for editing
      const fetchQuizData = async () => {
        try {
          const response = await axiosInstance.get(`/quiz/${id}`);
          const quizData = response.data.data;
          console.log(quizData);

          setQuestionType(quizData.questionType);
          setCategory(quizData.category);
          setQuizType(quizData.quizType);
          setOptionType(quizData.optionType);
          setQuestionTitle(quizData.questionTitle);
          const correctOptionObjIndex = quizData.options?.find?.(
            (opt) => opt._id === quizData?.correctOption
          )?.optionIndex;
          setCorrectOption(`option${correctOptionObjIndex}`);
          if (quizData.options) {
            let optionMappingWithData = {};
            quizData.options.forEach((opt) => {
              if (quizData.optionType !== "images") {
                if (opt.optionIndex === 1) {
                  setOption1(opt.optionText);
                }
                if (opt.optionIndex === 2) {
                  setOption2(opt.optionText);
                }
                if (opt.optionIndex === 3) {
                  setOption3(opt.optionText);
                }
                if (opt.optionIndex === 4) {
                  setOption4(opt.optionText);
                }
              } else {
                if (opt.optionIndex === 1) {
                  setThumbnail1(opt.optionImage);
                }
                if (opt.optionIndex === 2) {
                  setThumbnail2(opt.optionImage);
                }
                if (opt.optionIndex === 3) {
                  setThumbnail3(opt.optionImage);
                }
                if (opt.optionIndex === 4) {
                  setThumbnail4(opt.optionImage);
                }
              }
              
              optionMappingWithData[`option${opt.optionIndex}`] = opt;
            });

            setOptionMapping(optionMappingWithData);
          }
        } catch (error) {
          setResponseError("Failed to fetch quiz data.");
        }
      };
      fetchQuizData();
    }
  }, [id]);

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
  
    if (!correctOption) {
      setCorrectOptionError("Correct option is required");
      return;
    }
  
    // Prepare the form data
    const formData = new FormData();
    formData.append("questionType", questionType);
    formData.append("category", category);
    formData.append("quizType", quizType);
    formData.append("optionType", optionType);
    formData.append("questionTitle", questionTitle);
  
    // Add options based on optionType
    if (optionType === "trueFalse") {
      formData.append("option1", true);
      formData.append("option2", false);
    } else if (optionType === "images") {
      if (!thumbnail1) setOption1Error("Option 1 is required");
      if (!thumbnail2) setOption2Error("Option 2 is required");
      if (!thumbnail3) setOption3Error("Option 3 is required");
      if (!thumbnail4) setOption4Error("Option 4 is required");
  
      if (!id) {
        formData.append("option1", thumbnail1);
        formData.append("option2", thumbnail2);
        formData.append("option3", thumbnail3);
        formData.append("option4", thumbnail4);
      } else {
        formData.append("option1", JSON.stringify({ ...optionMapping["option1"], optionImage: thumbnail1 }));
        formData.append("option2", JSON.stringify({ ...optionMapping["option2"], optionImage: thumbnail2 }));
        formData.append("option3", JSON.stringify({ ...optionMapping["option3"], optionImage: thumbnail3 }));
        formData.append("option4", JSON.stringify({ ...optionMapping["option4"], optionImage: thumbnail4 }));
      }
    } else {
      if (!id) {
        formData.append("option1", option1);
        formData.append("option2", option2);
        formData.append("option3", option3);
        formData.append("option4", option4);
      } else {
        formData.append("option1", JSON.stringify({ ...optionMapping["option1"], optionText: option1 }));
        formData.append("option2", JSON.stringify({ ...optionMapping["option2"], optionText: option2 }));
        formData.append("option3", JSON.stringify({ ...optionMapping["option3"], optionText: option3 }));
        formData.append("option4", JSON.stringify({ ...optionMapping["option4"], optionText: option4 }));
      }
    }
  
    formData.append("correctOption", correctOption);
  
    try {
      // Submit the form data
      const response = id
        ? await axiosInstance.put(`/quiz/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await axiosInstance.post("/quiz", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
      if (response.status === 201 || response.status === 200) {
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
                  onChange={(e) => {
                    setOption1("");
                    setOption2("");
                    setOption3("");
                    setOption4("");
                    setOptionType(e.target.value);
                  }}
                />
                <Form.Check
                  inline
                  label="True/False"
                  type="radio"
                  name="optionType"
                  id="trueFalse"
                  value="trueFalse"
                  checked={optionType === "trueFalse"}
                  onChange={(e) => {
                    setOption1("True");
                    setOption2("False");
                    setOption3("");
                    setOption4("");
                    setOptionType(e.target.value);
                  }}
                  disabled
                />
                <Form.Check
                  inline
                  label="Images"
                  type="radio"
                  name="optionType"
                  id="images"
                  value="images"
                  checked={optionType === "images"}
                  onChange={(e) => {
                    setThumbnail1("");
                    setThumbnail2("");
                    setThumbnail3("");
                    setThumbnail4("");
                    setOptionType(e.target.value);
                  }}
                  disabled
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
                      disabled={optionType === "trueFalse"}
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
                      disabled={optionType === "trueFalse"}
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

            <Form.Group className="mb-3">
              <Form.Label>Correct Option</Form.Label>
              <Form.Control
                as="select"
                value={correctOption}
                onChange={(e) => setCorrectOption(e.target.value)}
                isInvalid={correctOptionError}
              >
                <option value="">Select Correct Option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                {optionType !== "trueFalse" && (
                  <>
                    <option value="option3">Option 3</option>
                    <option value="option4">Option 4</option>
                  </>
                )}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {correctOptionError}
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

export default AddEditQuiz;
