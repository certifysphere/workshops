import React, { useState, useEffect } from 'react';
import MockPublicToiletService from './service/mock-public-toilets-service';

const App = () => {
  // State variables
  const [publicToilets, setPublicToilets] = useState([]);
  const [selectedPublicToilet, setSelectedPublicToilet] = useState(null);

  // Mock service instance
  const service = MockPublicToiletService.getInstance();

  // Fetches public toilets data when the component mounts
  useEffect(() => {
    getPublicToilets();
  }, []);


  // Fetches the list of public toilets
  const getPublicToilets = async () => {
    try {
      const list = await service.getPublicToilets();
      setPublicToilets(list);
    } catch (error) {
      console.log('Error fetching public toilets:', error);
    }
  };

  // Deletes a public toilet
  const deleteToilet = async (id) => {
    try {
      await service.deletePublicToilet(id);
      getPublicToilets();
    } catch (error) {
      console.log('Error deleting public toilet:', error);
    }
  };

  // Updates a public toilet
  const updateToilet = async (selectedPublicToilet) => {
    try {
      await service.updatePublicToilet(selectedPublicToilet.id, selectedPublicToilet);
      getPublicToilets();
    } catch (error) {
      console.log('Error updating public toilet:', error);
    }
  };

  // Adds a new public toilet
  const addPublicToilet = async (publicToilet) => {
    try {
      await service.addPublicToilet(publicToilet);
      setPublicToilets([]);
      getPublicToilets();
    } catch (error) {
      console.log('Error adding public toilet:', error);
    }
  };

  // Renders the table of public toilets
  const renderPublicToilets = () => {
    //Display message when publicToilets array is empty
    if (!publicToilets || publicToilets.length === 0) {
      return <p>No Data Found</p>;
    }

    return (
      <table>
        {/* Table headers */}
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {publicToilets.map((publicToilet) => (
            <tr key={publicToilet.id}>
              {/* Radio button for selection */}
              <td>
                <input
                  type='radio'
                  name='publicToiletRecord'
                  onClick={() => setSelectedPublicToilet(publicToilet)}
                />
              </td>
              <td>{publicToilet.name}</td>
              <td>{publicToilet.city}</td>
              <td>{publicToilet.state}</td>
              <td>{publicToilet.country}</td>
              <td>
                {/* Delete button */}
                <button onClick={() => deleteToilet(publicToilet.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };



  // Handles the form submission for adding a
  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, city, state, country } = event.target.elements;
    const publicToilet = {
      name: name.value,
      city: city.value,
      state: state.value,
      country: country.value,
    };
    addPublicToilet(publicToilet);
    event.target.reset();
  };


  //Display Add a new PublicToilet form
  const renderAddPublicToiletForm = () => {
    return (
      <div >
        <h2>Add Public Toilet</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" />
          <input name="city" placeholder="City" />
          <input name="state" placeholder="State" />
          <input name="country" placeholder="Country" />
          <button type="submit">Add</button>
        </form>
      </div>
    );
  };

  //Display Update a PublicToilet form
  const renderUpdatePublicToiletForm = () => {
    const handleChange = (event) => {
      setSelectedPublicToilet({
        ...selectedPublicToilet,
        [event.target.name]: event.target.value,
      });
    };

    return (
      <>
        <h2>Update Public Toilet</h2>
        <input type='hidden' defaultValue={selectedPublicToilet.id} />
        <input name="name" value={selectedPublicToilet.name} onChange={handleChange} placeholder="Name" />
        <input name="city" value={selectedPublicToilet.city} onChange={handleChange} placeholder="City" />
        <input name="state" value={selectedPublicToilet.state} onChange={handleChange} placeholder="State" />
        <input name="country" value={selectedPublicToilet.country} onChange={handleChange} placeholder="Country" />
        <button onClick={() => updateToilet(selectedPublicToilet)}>Update</button>
      </>
    );
  };


  //Returns PublicToilets list, Add and Update component  
  return (
    <>
      <h1>Public Toilets</h1>
      {renderPublicToilets()}
      {renderAddPublicToiletForm()}
      {selectedPublicToilet && renderUpdatePublicToiletForm()}
    </>
  );
};

export default App;