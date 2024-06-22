import React from 'react';
import './Modal.css';
import successicn from './icons/ux/success.svg'
import failureicn from './icons/ux/failure.svg'

const SuccessIcon = () => (
    <img className='modal-icon' src={successicn} />
);

const FailureIcon = () => (
    <img className='modal-icon' src={failureicn} />
);


const Modal = ({ isOpen, onClose, title, message, isSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isSuccess ? <SuccessIcon /> : <FailureIcon />}
        <h2 className={`modal-title ${isSuccess ? 'success' : 'error'}`}>{title}</h2>
        <p>{message}</p>
        <button className="modal-close" onClick={onClose}>Ясно</button>
      </div>
    </div>
  );
};

export default Modal;