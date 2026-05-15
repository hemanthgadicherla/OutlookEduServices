import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { leadAPI } from "../services/api";

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
    }, 6000);

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
        name:
          formData.name.trim(),
        email: "",
        phone:
          formData.phone.trim(),
        subject:
          formData.subject,
        message:
          formData.message.trim()
      };

      console.log("Submitting Payload:", payload);

      const response =
        await leadAPI.createLead(
          payload
        );

      if (!response.success) {

        toast.error(
          response.message
        );

        return;

      }

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
      <Modal.Body
        className="p-4 position-relative"
        style={{
          background: "#111827",
          borderRadius: "18px",
          border: "1px solid rgba(255,215,0,0.15)"
        }}
      >

        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "transparent",
            border: "none",
            color: "#FFD700",
            fontSize: "1.4rem",
            cursor: "pointer"
          }}
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <h4
            className="fw-bold mb-2"
            style={{ color: "#FFD700" }}
          >
            Free Guidance
          </h4>

          <p
            className="mb-0"
            style={{
              color: "#d1d5db",
              fontSize: "0.9rem"
            }}
          >
            Get expert counseling for admissions, visas & Courses.
          </p>
        </div>

        <Form onSubmit={handleSubmit}>

          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                background: "#ffffff",
                border: "1px solid rgba(255,215,0,0.2)",
                color: "white",
                borderRadius: "10px",
                padding: "12px"
              }}
            />
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3">
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              maxLength={10}
              required
              style={{
                background: "#ffffff",
                border: "1px solid rgba(255,215,0,0.2)",
                color: "white",
                borderRadius: "10px",
                padding: "12px"
              }}
            />
          </Form.Group>

          {/* Subject */}
          <Form.Group className="mb-3">
            <Form.Select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              style={{
                background: "#1f2937",
                border: "1px solid rgba(255,215,0,0.2)",
                color: "white",
                borderRadius: "10px",
                padding: "12px"
              }}
            >
              <option value="">Select Services</option>

              <option value="Study Abroad Consultation">
                Study Abroad Consultation
              </option>

              <option value="Visa Services">
                Visa Services
              </option>

              <option value="Course Information">
                Course Information
              </option>

              <option value="Other">
                Other
              </option>
            </Form.Select>
          </Form.Group>

          {/* Submit */}
          <Button
            type="submit"
            className="w-100 fw-bold border-0 py-2"
            disabled={isSubmitting}
            style={{
              background: "linear-gradient(135deg, #FFD700, #f5c400)",
              color: "#111827",
              borderRadius: "10px"
            }}
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