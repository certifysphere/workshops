import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3002'; // Update this with your backend API URL

const App = () => {
  // State variables
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Fetch schools data when the component mounts
  useEffect(() => {
    getSchools();
  }, []);

  // Function to fetch the list of schools from the backend
  const getSchools = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/schools`);
      const data = await response.json();
      setSchools(data);
    } catch (error) {
      console.log('Error fetching schools:', error);
    }
  };

  // Function to delete a school from the backend
  const deleteSchool = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/schools/${id}`, {
        method: 'DELETE',
      });
      getSchools(); // Refresh the schools list after deletion
    } catch (error) {
      console.log('Error deleting school:', error);
    }
  };

  // Function to update a school in the backend
  const updateSchool = async (selectedSchool) => {
    try {
      await fetch(`${API_BASE_URL}/schools/${selectedSchool.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedSchool),
      });
      getSchools(); // Refresh the schools list after update
    } catch (error) {
      console.log('Error updating school:', error);
    }
  };

  // Function to add a new school to the backend
  const addSchool = async (school) => {
    try {
      await fetch(`${API_BASE_URL}/schools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(school),
      });
      getSchools(); // Refresh the schools list after addition
    } catch (error) {
      console.log('Error adding school:', error);
    }
  };

  // Function to render the table of schools
  const renderSchools = () => {
    if (!schools || schools.length === 0) {
      return <p>No Data Found</p>;
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>School Name</th>
            <th>Grades</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Zip Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id}>
              {/* Radio button for selection */}
              <td>
                <input
                  type='radio'
                  name='schoolRecord'
                  onClick={() => setSelectedSchool(school)}
                />
              </td>
              <td>{school.name}</td>
              <td>{school.grades}</td>
              <td>{school.city}</td>
              <td>{school.state}</td>
              <td>{school.country}</td>
              <td>{school.zipCode}</td>
              <td>
                {/* Delete button */}
                <button onClick={() => deleteSchool(school.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Function to handle the form submission for adding a school
  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, grades, city, state, country, zipCode } = event.target.elements;
    const school = {
      name: name.value,
      grades: grades.value,
      city: city.value,
      state: state.value,
      country: country.value,
      zipCode: zipCode.value,
    };
    addSchool(school); // Add the new school to the backend
    event.target.reset();
  };

  // Function to render the Add School form
  const renderAddSchoolForm = () => {
    return (
      <div>
        <h2>Add School</h2>
        <form onSubmit={handleSubmit}>
          <input name='name' placeholder='Name' />
          <input name='grades' placeholder='Grades' />
          <input name='city' placeholder='City' />
          <input name='state' placeholder='State' />
          <input name='country' placeholder='Country' />
          <input name='zipCode' placeholder='Zip Code' />
          <button type='submit'>Add</button>
        </form>
      </div>
    );
  };

  // Function to render the Update School form
  const renderUpdateSchoolForm = () => {
    // Function to handle input changes in the Update School form
    const handleChange = (event) => {
      setSelectedSchool({
        ...selectedSchool,
        [event.target.name]: event.target.value,
      });
    };

    return (
      <>
        <h2>Update School</h2>
        {/* Use the ID of the selected school */}
        <input type='hidden' name='id' defaultValue={selectedSchool.id} />
        <input
          name='name'
          value={selectedSchool.name}
          onChange={handleChange}
          placeholder='Name'
        />
        <input
          name='grades'
          value={selectedSchool.grades}
          onChange={handleChange}
          placeholder='Grades'
        />
        <input
          name='city'
          value={selectedSchool.city}
          onChange={handleChange}
          placeholder='City'
        />
        <input
          name='state'
          value={selectedSchool.state}
          onChange={handleChange}
          placeholder='State'
        />
        <input
          name='country'
          value={selectedSchool.country}
          onChange={handleChange}
          placeholder='Country'
        />
        <input
          name='zipCode'
          value={selectedSchool.zipCode}
          onChange={handleChange}
          placeholder='Zip Code'
        />
        <button onClick={() => updateSchool(selectedSchool)}>Update</button>
        <button onClick={() => setSelectedSchool(null)}>Cancel</button>
      </>
    );
  };

  // Render the main UI of the app
  return (
    <div>
      <h1>Schools Listing App</h1>
      <div>
        {/* Render the table of schools */}
        {renderSchools()}
        {/* Render the Add School form */}
        {selectedSchool ? (
          // Render the Update School form when a school is selected
          renderUpdateSchoolForm()
        ) : (
          // Render the Add School form when no school is selected
          renderAddSchoolForm()
        )}
      </div>
    </div>
  );
};

export default App;
