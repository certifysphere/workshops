import React, { useState } from 'react';

function PublicToiletsForm(props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const publicToilet = { name, address, gender };
    props.onSubmit(publicToilet);
    setName('');
    setAddress('');
    setGender('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input type="text" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="gender">Gender</label>
        <input type="text" className="form-control" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary">{props.buttonLabel}</button>
    </form>
  );
}

export default PublicToiletsForm;
