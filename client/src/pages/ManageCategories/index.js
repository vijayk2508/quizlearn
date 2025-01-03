import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Form,
  Button,
  Breadcrumb,
  InputGroup,
} from "@themesberg/react-bootstrap";

import AddEditCategoriesModal from "./AddEditCategoriesModal";
import CategoriesList from "./CategoriesList";

export default () => {
  const [showModal, setShowModal] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}
          >
            <Breadcrumb.Item>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Volt</Breadcrumb.Item>
            <Breadcrumb.Item active>Categories</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Categories</h4>
        </div>
      </div>

      <div className="table-settings mb-4">
        <Row className="justify-content-between align-items-center">
          <Col xs={8} md={6} lg={3} xl={4}>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <Form.Control type="text" placeholder="Search" />
            </InputGroup>
          </Col>
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
            <Button
              variant="primary"
              className="m-1"
              onClick={() => setShowModal(true)}
            >
              Add Categories
            </Button>
          </Col>
        </Row>
      </div>

      <CategoriesList refresh={refresh} handleRefresh={handleRefresh} />
      <AddEditCategoriesModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleRefresh={handleRefresh}
      />
    </>
  );
};
