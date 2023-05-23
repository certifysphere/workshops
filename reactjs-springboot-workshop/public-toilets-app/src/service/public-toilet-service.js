

const REST_API_URL = 'http://localhost:8080';

export default class PublicToiletService {

    /**
     * Retrieves the list of public toilets from the backend API.
     * @returns {Promise<Array>} A promise that resolves to the array of public toilets.
     */
    async getPublicToilets() {
        const response = await fetch(REST_API_URL + '/api/public-toilets');
        return await response.json();
    }

    /**
     * Adds a new public toilet to the backend API.
     * @param {Object} publicToilet - The public toilet object to be added.
     * @returns {Promise<Object>} A promise that resolves to the added public toilet object.
     */
    async addPublicToilet(publicToilet) {
        const response = await fetch(REST_API_URL + '/api/public-toilets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(publicToilet),
        });
        return await response.json();
    }

    /**
     * Deletes a public toilet from the backend API by its id.
     * @param {number} id - The id of the public toilet to be deleted.
     */
    async deletePublicToilet(id) {
        fetch(REST_API_URL + `/api/public-toilets/${id}`, {
            method: 'DELETE',
        });
    }

    /**
     * Updates a public toilet in the backend API by its id.
     * @param {number} id - The id of the public toilet to be updated.
     * @param {Object} publicToilet - The updated public toilet object.
     * @returns {Promise<Object>} A promise that resolves to the updated public toilet object.
     */
    async updatePublicToilet(id, publicToilet) {
        const response = await fetch(REST_API_URL + `/api/public-toilets/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(publicToilet),
        });
        return await response.json();
    }
}
