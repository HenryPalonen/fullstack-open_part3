const express = require('express');
const app = express();
const morgan = require('morgan');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(morgan('tiny'));
app.use(express.json()); // parse JSON request bodies

morgan.token('postData', (req) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    }
    return '';
  });
  
// Morgan middleware konfiguroituna tiny-konfiguraatiolla ja käyttäen luotua 'postData' tokenia
app.use(morgan(':method :url :status :response-time ms - :postData'));
  
let persons = [
  { id: 1, name: 'Henry Palonen', number: '123-456789' },
  { id: 2, name: 'Patrick Palonen', number: '123456789' },
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
    const currentTime = new Date().toLocaleString();
    const personCount = persons.length;
    const infoMessage = `Phonebook has info for ${personCount} people`;
  
    res.send(`<p>${currentTime}</p><p>${infoMessage}</p>`);
  });

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
  
    if (person) {
      res.json(person);
    } else {
      res.status(404).send('Person not found');
    }
  });

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);
    res.status(204).end();
  });

  app.post("/api/persons", (request, response, next) => {
    const body = request.body;
  
    // Check if name already exists in persons array
    const personExists = persons.some((person) => person.name === body.name);
  
    if (personExists) {
      return response.status(400).json({ error: 'Name already exists in the phonebook' });
    }
  
    // New Object to Db
    
    const newPerson  ={
      id: Math.floor(Math.random() * 1000),
      name: body.name,
      number: body.number,
    };
  
    /*newPerson
      .save()
      .then(savedPerson => {
        response.json(savedPerson);
      })
      .catch(error => next(error));*/

    persons.push(newPerson); // Add the new person to the persons array
    response.json(newPerson);
  });
  
  const PORT = 3001;
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
