import React from 'react';
import Card from '../../shared/components/UIElements/Card';
import CertificateItem from './CertificateItem';
import './CertificateList.css';
import Button from 'D:/OneDrive/vu uni/web programming/front end/src/shared/components/FromElements/Button.js';

const CertificateList = props => {
  //if no certificates are available, display a message and a button to create a new certificate
  if (props.items.length === 0) {
    return (
      <div className="certificate-list center">
        <Card>
          <h2>No certificates found. Maybe create one?</h2>
          <Button to="/certificates/new">Share Certificate</Button>
        </Card>
      </div>
    );
  }
  //render the list of certificates
  return (
    <ul className="certificate-list">
      {props.items.map(certificate => (
        <CertificateItem
          key={certificate.id}
          id={certificate.id}
          image={certificate.image}
          title={certificate.title}
          description={certificate.description}
          creatorId={certificate.creator}
          onDelete={props.onDeleteCertificate}
        />
      ))}
    </ul>
  );
};

export default CertificateList;
