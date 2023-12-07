import axios from 'axios'

//const baseUrl = 'http://localhost:3001/persons'
//const baseUrl = 'http://localhost:3001/api/persons'
//const baseUrl = 'http://localhost:3001/phonebook-server/api/persons';
const baseUrl = '/api/persons'; // for server installation

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson)
  .then(response => response.data)
  // validation error messaages included
 // .catch(error => console.log(error.response.data))
 .catch(error => {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.error); // Throw the validation error message
    } else {
      throw error; // Rethrow other errors
    }
  });
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

const update = (id, updatedPerson) => {
    return axios.put(`${baseUrl}/${id}`, updatedPerson).then(response => response.data);
  };
  
export default { 
    getAll, 
    create, 
    remove,
    update
};