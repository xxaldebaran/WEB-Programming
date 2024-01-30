import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

//content of the modal
const ModalOverlay = props => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      {/*modal header */}
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : event => event.preventDefault()
        }
      >
        {/*modal content */}
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        {/*modal footer */}
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  //render the modal content using ReactDOM.createPortal
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = props => {
  return (
    <React.Fragment>
      {/*render the backdrop if show prop is true */}
      {props.show && <Backdrop onClick={props.onCancel} />}
      {/*CSS transition component from react-transition-group handles the animation */}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        {/*render the ModalOverlay component */}
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;