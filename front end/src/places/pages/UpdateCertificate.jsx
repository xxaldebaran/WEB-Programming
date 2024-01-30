import React, { useEffect, useState, useContext } from 'react';
import { useParams,  useHistory } from 'react-router-dom';
import Input from 'D:/OneDrive/vu uni/web programming/front end/src/shared/components/FromElements/Input.js';
import Button from 'D:/OneDrive/vu uni/web programming/front end/src/shared/components/FromElements/Button.js';
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from 'D:/OneDrive/vu uni/web programming/front end/src/shared/components/util/validators.js';
import './CertificateForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

  
const UpdateCertificate = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCertificate, setLoadedCertificate] = useState();
  const certificateId = useParams().certificateId;
  const history = useHistory();
  //initialize the form state using the useForm hook
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );
  //fetch the certificate data from the server when the component mounts
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/certificates/${certificateId}`
        );
        //set the loaded certificate data and update the form state
        setLoadedCertificate(responseData.certificate);
        setFormData(
          {
            title: {
              value: responseData.certificate.title,
              isValid: true
            },
            description: {
              value: responseData.certificate.description,
              isValid: true
            }
          },
          true
        );
      } catch (err) {}
    };
    fetchCertificate();
  }, [sendRequest, certificateId, setFormData]);

  //handle the certificate update form submission
  const certificateUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/certificates/${certificateId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      //redirect the user to the certificate list page after the certificate is updated
      history.push('/' + auth.userId + '/certificates');
    } catch (err) {}
  };
  //if the certificate data is not loaded yet, show a loading spinner
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }
  //if the certificate data is loaded, show the certificate update form
  if (!loadedCertificate && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find certificate!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedCertificate && (
        <form className="certificate-form" onSubmit={certificateUpdateSubmitHandler}>
          {/*input field for the certificate title */}
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedCertificate.title}
            initialValid={true}
          />
          {/*input field for the certificate description */}
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedCertificate.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE CERTIFICAYE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateCertificate;


