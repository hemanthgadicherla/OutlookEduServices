import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const LeadPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setShow(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Form Submitted Successfully!");

    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Get Free Study Abroad Guidance
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter your phone number"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Interested In</Form.Label>

            <div>
              <Form.Check
                type="radio"
                label="Countries"
                name="interest"
                value="Countries"
              />

              <Form.Check
                type="radio"
                label="Courses"
                name="interest"
                value="Courses"
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your message..."
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
          >
            Submit
          </Button>

        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LeadPopup;