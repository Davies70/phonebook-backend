// Here is an enhanced and improved version of the 'code_under_test' code snippet:

// Define the initial data array
let data = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

// Import required modules
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// Use middleware
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// Define custom morgan token for logging request body data
morgan.token('bodyData', (request, response) => {
  return JSON.stringify(request.body);
});
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :bodyData'
  )
);

// Get all persons
app.get('/api/persons', (request, response) => {
  response.json(data);
});

// Get information about the phonebook
app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${data.length} people</p><p>${new Date()}</p>`
  );
});

// Get a single person by ID
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = data.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// Delete a person by ID
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  data = data.filter((person) => person.id !== id);
  response.status(204).end();
});

// Add a new person
app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: 'Name or number is missing',
    });
  }

  const existingPerson = data.find((person) => person.name === name);
  if (existingPerson) {
    return response.status(400).json({
      error: 'Name must be unique',
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name,
    number,
  };

  data.push(person);
  response.json(person);
});

// Set the port
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
