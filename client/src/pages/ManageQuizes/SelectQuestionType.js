import React from "react";
import { Form } from "@themesberg/react-bootstrap";
import questionTypeData from "../../data/questiontypedata";

function SelectQuestionType({ onChange, value, fromGroupClassName }) {
  return (
    <Form.Group controlId="selectCategory" className={fromGroupClassName}>
      <Form.Label>Question Type</Form.Label>
      <Form.Control as="select" onChange={onChange} value={value}>
        <option value="">Select a Question Type</option>
        {Object.values(questionTypeData).map((questionType) => (
          <option key={questionType.value} value={questionType.value}>
            {questionType.label}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}

export default SelectQuestionType;
