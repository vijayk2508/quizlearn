import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEllipsisH,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  Nav,
  Card,
  Button,
  Table,
  Dropdown,
  Pagination,
  ButtonGroup,
  Modal,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";

import axiosInstance from "../../service";
import AddEditQuiz from "./AddEditQuiz";

const QuizList = ({ refresh, handleRefresh }) => {
  const [quizTypes, setQuizTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [quizToEdit, setQuizToEdit] = useState(null);

  useEffect(() => {
    const fetchQuizTypes = async () => {
      try {
        const response = await axiosInstance.get(
          `/quiz?page=${currentPage}&limit=10`
        );
        setQuizTypes(response.data.quizzes);
        setTotalPages(Math.ceil(response.data.total / 10));
        setLoading(false);
      } catch (error) {
        setError("Error fetching quiz types. Please try again.");
        setLoading(false);
      }
    };

    fetchQuizTypes();
  }, [currentPage, refresh]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (id) => {
    setQuizToEdit(id);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setQuizToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/quiz/${quizToDelete}`);
      setShowDeleteModal(false);
      setQuizToDelete(null);
      handleRefresh(!refresh); // Refresh the quiz types list
    } catch (error) {
      setError("Error deleting quiz type. Please try again.");
      setShowDeleteModal(false);
      setQuizToDelete(null);
    }
  };

  const TableRow = (props) => {
    const { category, id, _id, quizType, optionType,questionTitle, options, correctOption } =
      props;

    return (
      <tr>
        <td>
          <Card.Link as={Link} className="fw-normal">
            {id}
          </Card.Link>
        </td>
        <td>
          <span className="fw-normal">{category.name}</span>
        </td>
        <td>
          <span className="fw-normal">{quizType.name}</span>
        </td>
        <td>
          <span className="fw-normal">{questionTitle}</span>
        </td>
        <td>
          <span className="fw-normal">{optionType}</span>
        </td>
        <td>
          <ul>
            {options?.map?.((option) => (
              <li key={option?._id}>{option.optionText}</li>
            ))}
          </ul>
        </td>
        <td>{options.find((opt) => opt._id === correctOption)?.optionText}</td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle
              as={Button}
              split
              variant="link"
              className="text-dark m-0 p-0"
            >
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleEdit(_id)}>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleDelete(_id)}
                className="text-danger"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Remove
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <>
      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <>
              <Table hover className="user-table align-items-center">
                <thead>
                  <tr>
                    <th className="border-bottom">#</th>
                    <th className="border-bottom">Category</th>
                    <th className="border-bottom">Quiz Type</th>
                    <th className="border-bottom">Question Title</th>
                    <th className="border-bottom">Option Type</th>
                    <th className="border-bottom">Options</th>
                    <th className="border-bottom">Correct Option</th>
                    <th className="border-bottom">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {quizTypes.map((quizType, idx) => (
                    <TableRow id={idx + 1} key={quizType._id} {...quizType} />
                  ))}
                </tbody>
              </Table>
              <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
                <Nav>
                  <Pagination className="mb-2 mb-lg-0">
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Pagination.Prev>
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Pagination.Next>
                  </Pagination>
                </Nav>
                <small className="fw-bold">
                  Showing <b>{quizTypes.length}</b> out of{" "}
                  <b>{totalPages * quizTypes.length}</b> entries
                </small>
              </Card.Footer>
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this quiz type?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {showEditModal && (
        <AddEditQuiz
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          id={quizToEdit}
          handleRefresh={handleRefresh}
        />
      )}
    </>
  );
};

export default QuizList;
