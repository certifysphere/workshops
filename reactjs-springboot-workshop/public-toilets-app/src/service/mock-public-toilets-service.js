/**
 * Singleton mock service for handling public toilets data.
 */
export default class MockPublicToiletService {
  static instance;

  // Array to store public toilets data
  publicToilets = [];

  /**
   * Returns the singleton instance of the MockPublicToiletService class.
   * If the instance doesn't exist, it creates a new one.
   * @returns {MockPublicToiletService} The singleton instance.
   */
  static getInstance() {
    if (!MockPublicToiletService.instance) {
      MockPublicToiletService.instance = new MockPublicToiletService();
    }
    return MockPublicToiletService.instance;
  }

  /**
   * Retrieves the list of public toilets.
   * @returns {Promise<Array>} A promise that resolves to the array of public toilets.
   */
  getPublicToilets() {
    return Promise.resolve(this.publicToilets);
  }

  /**
   * Adds a new public toilet to the list.
   * @param {Object} publicToilet - The public toilet object to be added.
   * @returns {Promise<Object>} A promise that resolves to the added public toilet object.
   */
  addPublicToilet(publicToilet) {
    // Get the maximum id from the existing public toilets
    const maxId = this.publicToilets.reduce((max, obj) => Math.max(max, obj.id), 0);

    // Assign a new id to the public toilet
    publicToilet.id = maxId + 1;

    // Add the public toilet to the list
    this.publicToilets.push(publicToilet);

    return Promise.resolve(publicToilet);
  }

  /**
   * Deletes a public toilet from the list by its id.
   * @param {number} id - The id of the public toilet to be deleted.
   */
  deletePublicToilet(id) {
    this.publicToilets = this.publicToilets.filter(publicToilet => publicToilet.id !== id);
  }

  /**
   * Updates a public toilet in the list by its id.
   * @param {number} id - The id of the public toilet to be updated.
   * @param {Object} publicToilet - The updated public toilet object.
   */
  updatePublicToilet(id, publicToilet) {
    this.publicToilets = this.publicToilets.map(item => (item.id === id ? publicToilet : item));
  }
}
