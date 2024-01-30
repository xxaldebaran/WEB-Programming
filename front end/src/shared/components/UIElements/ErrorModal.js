import React from 'react';

import Modal from './Modal';
import Button from 'D:/OneDrive/vu uni/web programming/front end/src/shared/components/FromElements/Button.js';

const ErrorModal = props => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;

