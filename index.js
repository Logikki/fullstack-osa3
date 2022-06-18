const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')

// let persons = [
// { 
//   "name": "Arto Hellas", 
//   "number": "040-123456",
//   "id": 1
// },
// { 
//   "name": "Ada Lovelace", 
//   "number": "39-44-5323523",
//   "id": 2
// },
// { 
//   "name": "Dan Abramov", 
//   "number": "12-43-234345",
//   "id": 3
// },
// { 
//   "name": "Mary Poppendieck", 
//   "number": "39-23-6423122",
//   "id": 4
// }
// ]


app.use(express.json())
morgan.token('body', (req)=> JSON.stringify(req.body))

app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`, 
{skip: (req,res)=> req.method !== "POST"}))

app.use(morgan('tiny', {skip: (req,res)=> req.method === "POST"}))
app.use(cors())

app.use(express.static('build'))

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
    }

app.get('/api/persons', (req, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
    })

app.get('/info', (req,res) => {
    let entries = persons.length
    let date = new Date().toString()
    page = `<p>Phonebook has info for ${entries} people</p> 
            <p>${date}</p>`

    res.send(page)

})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
  })

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or number is missing' 
      })
    }

    let names = persons.map(p => p.name)
    if (names.includes(body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person( {
     name : body.name,
     number : body.number,
    id: generateId()
    })
  
    person.save().then(savedPerson =>{
      response.json(savedPerson)
    })
  })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

