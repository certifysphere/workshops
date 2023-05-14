import React, { useState, useEffect } from 'react';
import PublicToiletsService from '../services/PublicToiletsService';
import PublicToiletsCreate from './PublicToiletsCreate'

const PublicToiletsList = () => {
  const [publicToilets, setPublicToilets] = useState([]);
  const [selectedPublicToilet, setSelectedPublicToilet] = useState(null);


  useEffect(() => {
    PublicToiletsService.getAllPublicToilets().then((response) => {
      console.log('PublicToiletsList useEffect - ' + JSON.stringify(response));
      setPublicToilets(response);
    });
  }, []);

  const updatePublicToilet = (publicToilet) => {
    // implementation for updating a public toilet with the given id
    PublicToiletsService.updatePublicToilet(publicToilet).then((response) => {
      setPublicToilets(response);
    });
  }

  const deletePublicToilet = (id) => {
    // implementation for deleting a public toilet with the given id
    PublicToiletsService.deletePublicToilet(id).then((response) => {
      this.setState({
        publicToilets: this.state.publicToilets.filter((publicToilet) => publicToilet.id !== id),
      });
    });
  };

  // const addPublicToilet = (publicToilet) => {
  //   PublicToiletsService.addPublicToilet(publicToilet).then((response) => {
  //     setPublicToilets([...publicToilets, response.data]);
  //   });
  // };

  return (
    <div>
      <h2 className="text-center">Public Toilets List</h2>
      <div className="row">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {publicToilets && publicToilets.map((publicToilet) => (
              <tr key={publicToilet.id}>
                <td>{publicToilet.name}</td>
                <td>{publicToilet.address}</td>
                <td>{publicToilet.gender}</td>
                <td>
                  <button className="btn btn-primary" 
                  onClick={
                    () => setSelectedPublicToilet(publicToilet)
                    }>Update</button>
                  <button className="btn btn-danger" 
                  onClick={
                    () => deletePublicToilet(publicToilet.id)
                    }>Delete</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row">
        <PublicToiletsCreate></PublicToiletsCreate>
      </div>

    </div>
    
  );
};

export default PublicToiletsList;
