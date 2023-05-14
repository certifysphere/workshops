
//let publicToilets = [];
function isNullOrEmpty(value) {
  return value === null || value === undefined || value === '';
}

const storeInLocalStorage= (publicToilets) => {
  console.log('storeInLocalStorage {}' + JSON.stringify(publicToilets));
  localStorage.setItem('Toilets', JSON.stringify(publicToilets))
}

function getFromLocalStorage(){
  console.log('publicToilets->' + isNullOrEmpty(localStorage.getItem('Toilets')));
  return isNullOrEmpty(localStorage.getItem('Toilets')) ? []: JSON.parse(localStorage.getItem('Toilets'));
}
// const publicToilets= () => {
//   console.log('publicToilets->' + isNullOrEmpty(localStorage.getItem('Toilets')));
//   return isNullOrEmpty(localStorage.getItem('Toilets')) ? []: JSON.parse(localStorage.getItem('Toilets'));
// }



const PublicToiletsService = {

  getAllPublicToilets: () => {
    return Promise.resolve(getFromLocalStorage());
  },

  createPublicToilet: (publicToilet) => {
    let publicToilets = getFromLocalStorage();
    console.log('createPublicToilet publicToilets ' + JSON.stringify(publicToilets));
    
    publicToilets.push(publicToilet);

    //update localstorage with updated array
    storeInLocalStorage(publicToilets);
    
    return Promise.resolve(publicToilet);
  },

  updatePublicToilet: (publicToilet) => {
    let publicToilets = getFromLocalStorage();

    const index = publicToilets.findIndex((p) => p.id === publicToilet.id);
    if (index !== -1) {
      publicToilets[index] = publicToilet;

      //update localstorage with updated array
      storeInLocalStorage(publicToilets);
      return Promise.resolve(publicToilets);
    } else {
      return Promise.reject(new Error(`Public toilet with id ${publicToilet.id} not found`));
    }
  },

  deletePublicToilet: (id) => {
    let publicToilets = getFromLocalStorage();

    const index = publicToilets.findIndex((p) => p.id === id);
    if (index !== -1) {
      const deleted = publicToilets.splice(index, 1);
      //update localstorage with updated array
      storeInLocalStorage(deleted);
      return Promise.resolve(deleted[0]);
    } else {
      return Promise.reject(new Error(`Public toilet with id ${id} not found`));
    }
  },
};

export default PublicToiletsService;


