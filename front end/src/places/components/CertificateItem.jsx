import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FromElements/Button';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './CertificateItem.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const CertificateItem = props => {
  //initialize the httpClient and auth context
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  //state to control the delete confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  //show the delete confirmation modal
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  
  //cancel the deletion and close the modal
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  
  //confirm the deletion and send a DELETE request to the server
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/certificates/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      {/*error modal to display any errors */}
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="certificate-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this certificate? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      {/*render the certificate item */}
      <li className="certificate-item">
        <Card className="certificate-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          {/*display the certificate image */}
          <div className="certificate-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
          </div>
          {/*display the certificate title and description */}
          <div className="certificate-item__info">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
          </div>
          {/*render the edit button if the authenticated user is the creator of the certificate */}
          <div className="certificate-item__actions">
            {auth.userId === props.creatorId && (
              <Button to={`/certificates/${props.id}`}>EDIT</Button>
            )}
            {/*render the delete button if the authenticated user is the creator of the certificate */}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default CertificateItem;

