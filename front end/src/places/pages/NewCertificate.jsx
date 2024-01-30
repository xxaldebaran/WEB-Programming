import React, {useContext} from 'react';
import Input from 'D:/OneDrive/vu uni/web programming/front end/src/shared/components/FromElements/Input.js';
import Button from 'D:/OneDrive/vu uni/web programming/front end/src/shared/components/FromElements/Button.js';
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from 'D:/OneDrive/vu uni/web programming/front end/src/shared/components/util/validators.js';
import './CertificateForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHistory } from 'react-router-dom';
import ImageUpload from '../../shared/components/FromElements/ImageUpload';

const NewCertificate = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  //initialize the form state using the useForm hook
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  );

  const history = useHistory();
  
  //handle the certificate form submission
  const certificateSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('image', formState.inputs.image.value);
      //send a POST request to create a new certificate
      await sendRequest('http://localhost:5000/api/certificates', 'POST', formData, {
        Authorization: 'Bearer ' + auth.token
      });
      //redirect to the homepage after successful submission
      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="certificate-form" onSubmit={certificateSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        {/*input field for the certificate title */}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        {/*input field for the certificate description */}
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        {/*image upload field for the certificate */}
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD CERTIFICATE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewCertificate;

