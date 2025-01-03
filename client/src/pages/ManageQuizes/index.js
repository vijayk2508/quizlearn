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

import AddEditQuiz from "./AddEditQuiz";
import QuizTypesList from "./QuizList";

export default () => {
  const [showModal, setShowModal] = useState(true);

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
            <Breadcrumb.Item active>Quiz Types</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Quiz Types</h4>
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
              Add Quiz Type
            </Button>
          </Col>
        </Row>
      </div>

      <QuizTypesList refresh={refresh} handleRefresh={handleRefresh} />
      <AddEditQuiz
        showModal={showModal}
        setShowModal={setShowModal}
        handleRefresh={handleRefresh}
      />
    </>
  );
};
