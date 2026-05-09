import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { supabase } from "../services/supabase";

const LeadPopup = () => {
  const [show, setShow] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  // Close popup
  const handleClose = () => {
    setShow(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    if (!formData.subject) {
      toast.error("Please select a subject");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      };

      console.log("Submitting Payload:", payload);

      const { data, error } = await supabase
        .from("leads")
        .insert([payload])
        .select();

      if (error) {
        console.error("Supabase Error:", error);
        toast.error(error.message);
        return;
      }

      console.log("Inserted Data:", data);

      toast.success("Thank you! We'll contact you soon.");

      // Reset form
      setFormData({
        name: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Close popup
      setShow(false);
    } catch (err) {
      console.error("Unexpected Error:", err);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>

            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>

            <Form.Control
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              maxLength={10}
              required
            />
          </Form.Group>

          {/* Subject */}
          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>

            <Form.Select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a subject...</option>

              <option value="Study Abroad Consultation">
                Study Abroad Consultation
              </option>

              <option value="Visa Services">
                Visit Visa
              </option>

              <option value="Course Information">
                Course Information
              </option>

              <option value="Other">
                Other
              </option>
            </Form.Select>
          </Form.Group>

          {/* Message */}
          <Form.Group className="mb-4">
            <Form.Label>Message</Form.Label>

            <Form.Control
              as="textarea"
              rows={4}
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleInputChange}
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>

        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LeadPopup;