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
import AddEditCategoriesModal from "./AddEditCategoriesModal";

const CategoriesList = ({refresh, handleRefresh}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          `/categories?page=${currentPage}&limit=10`
        );
        setCategories(response.data.categories);
        setTotalPages(Math.ceil(response.data.total / 10));
        setLoading(false);
      } catch (error) {
        setError("Error fetching categories. Please try again.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage, refresh]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (id) => {
    setCategoryToEdit(id);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/categories/${categoryToDelete}`);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      handleRefresh(!refresh); // Refresh the categories list
    } catch (error) {
      setError("Error deleting category. Please try again.");
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const TableRow = (props) => {
    const { id, _id, name, thumbnailImage, createdAt, updatedAt } = props;

    return (
      <tr>
        <td>
          <Card.Link as={Link} className="fw-normal">
            {id}
          </Card.Link>
        </td>
        <td>
          <span className="fw-normal">{name}</span>
        </td>
        <td>
          <img
            src={thumbnailImage}
            alt={name}
            style={{ width: "50px", height: "50px" }}
          />
        </td>
        <td>
          <span className="fw-normal">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {new Date(updatedAt).toLocaleDateString()}
          </span>
        </td>
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
                    <th className="border-bottom">Name</th>
                    <th className="border-bottom">Thumbnail</th>
                    <th className="border-bottom">Created At</th>
                    <th className="border-bottom">Updated At</th>
                    <th className="border-bottom">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, idx) => (
                    <TableRow id={idx + 1} key={category._id} {...category} />
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
                  Showing <b>{categories.length}</b> out of{" "}
                  <b>{totalPages * categories.length}</b> entries
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
        <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
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
        <AddEditCategoriesModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          id={categoryToEdit}
          handleRefresh={handleRefresh}
        />
      )}
    </>
  );
};

export default CategoriesList;