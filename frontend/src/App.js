import { useState, useEffect } from 'react';
import comm from './components/comm'
import './App.css'; 
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';



const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success'); // 'success' or 'error'


  useEffect(() => {
    comm.getAll()
    .then(persons => setPersons(persons))
    .catch(error => {
      setMessageType('error');
      setMessage('Could not retrieve persons');
    });
}, []);

  useEffect(() => {
    if (message !== null) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message]);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  }

  const handleAddPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(p => p.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        comm.update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
          setNewName('');
          setNewNumber('');
          setMessageType('success');
          setMessage(`Updated ${returnedPerson.name}`);
        })
        .catch(error => {
          setMessageType('error');
          //setMessage(`Information of ${newName} has already been removed from server`);
          //setPersons(persons.filter(p => p.id !== existingPerson.id)); 
          // update error messaging from backend
          setMessage(error.message); // Set the error message received from the backend
        });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      };
      comm.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setMessageType('success');
          setMessage(`Added ${returnedPerson.name}`);
        })
        .catch(error => {
          setMessageType('error');
          setMessage(error.message);
        });
    }
  };
  

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      comm.remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
        setMessageType('success');
          setMessage(`Deleted ${person.name}`);
        })
        .catch(error => {
          setMessageType('error');
          setMessage('Could not delete ${person.name');
        });
    }
  }

  const personsToShow = filterValue === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      {message && <div className={`message ${messageType}`}>{message}</div>}


      <Filter filterValue={filterValue} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleAddPerson={handleAddPerson}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )

}

export default App;
