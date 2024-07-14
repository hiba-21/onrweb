import React, { useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";

const ApplyFormModal = ({ onClose, onSubmit }) => {
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setGuestInfo({
      ...guestInfo,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestInfo.name || !guestInfo.email || !guestInfo.resume) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields.",
      });
      return;
    }
    const formData = new FormData();
    formData.append("name", guestInfo.name);
    formData.append("email", guestInfo.email);
    formData.append("resume", guestInfo.resume);
    onSubmit(formData);
  };

  return (
    <ModalWrapper>
      <ModalContent>
        <h2>Apply for the Job</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            placeholder="Your Name"
            value={guestInfo.name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Your Email"
            value={guestInfo.email}
            onChange={handleChange}
            required
          />
          <Input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            required
          />
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
        </form>
      </ModalContent>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border: none;
  border-radius: 4px;
  background: var(--color-accent);
  color: #fff;
  cursor: pointer;
  &:hover {
    background: var(--color-black);
  }
`;

export default ApplyFormModal;
