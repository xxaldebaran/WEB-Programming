import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import CertificateList from '../components/CertificateList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserCertificates = () => {
  const [loadedCertificates, setLoadedCertificates] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  //extract the userId parameter from the URL
  const userId = useParams().userId;

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        //send a request to the server to fetch the user's certificates
        const responseData = await sendRequest(
          `http://localhost:5000/api/certificates/user/${userId}`
        );
        setLoadedCertificates(responseData.certificates);
      } catch (err) {}
    };
    fetchCertificates();
  }, [sendRequest, userId]);

  //handler function to delete a certificate
  const certificateDeletedHandler = deletedCertificateId => {
    setLoadedCertificates(prevCertificates =>
      prevCertificates.filter(certificate => certificate.id !== deletedCertificateId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/*show loading spinner while fetching data */}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {/*render the list of certificates */}
      {!isLoading && loadedCertificates && (
        <CertificateList items={loadedCertificates} onDeleteCertificate={certificateDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserCertificates;

