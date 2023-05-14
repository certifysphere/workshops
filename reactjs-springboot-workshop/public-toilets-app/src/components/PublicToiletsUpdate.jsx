import React, { useState } from 'react';
import PublicToiletsForm from './PublicToiletsForm';
import PublicToiletsService from '../services/PublicToiletsService';

function PublicToiletsUpdate(props) {
    const [errorMessage, setErrorMessage] = useState('');
    const [publicToilet, setPublicToilet] = useState(props.publicToilet);
  
    const handleUpdate = (updatedPublicToilet) => {
      PublicToiletsService.updatePublicToilet(updatedPublicToilet)
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    };
  
    return (
      <div>
        <h2>Update Public Toilet</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <PublicToiletsForm onSubmit={handleUpdate} buttonLabel="Update" />
        </div>
    );
  }

  export default PublicToiletsUpdate;
