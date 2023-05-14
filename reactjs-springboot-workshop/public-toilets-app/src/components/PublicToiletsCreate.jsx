import React, { useState } from 'react';
import PublicToiletsForm from './PublicToiletsForm';
import PublicToiletsService from '../services/PublicToiletsService';

function PublicToiletsCreate() {
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = (publicToilet) => {
    PublicToiletsService.createPublicToilet(publicToilet)
      .then(() => {
        console.log('createPublicToilet completed.');
        window.location.reload();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div>
      <h2>Create Public Toilet</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <PublicToiletsForm onSubmit={handleCreate} buttonLabel="Create" />
    </div>
  );
}

export default PublicToiletsCreate;
