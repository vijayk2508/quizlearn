import { Form } from "@themesberg/react-bootstrap";
import React from "react";

function RadioOptionType() {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Option Type</Form.Label>
      <div>
        <Form.Check
          inline
          label="Text Only"
          type="radio"
          name="optionType"
          id="textOnly"
        />
        <Form.Check
          inline
          label="True/False"
          type="radio"
          name="optionType"
          id="trueFalse"
        />
        <Form.Check
          inline
          label="Images"
          type="radio"
          name="optionType"
          id="images"
        />
      </div>
    </Form.Group>
  );
}

export default RadioOptionType;
