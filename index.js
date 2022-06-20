const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
morgan.token('body', (req)=> JSON.stringify(req.body))

app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`, 
{skip: (req,res)=> req.method !== "POST"}))

app.use(morgan('tiny', {skip: (req,res)=> req.method === "POST"}))
app.use(cors())

app.use(express.static('build'))


app.get('/api/persons', (req, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
    })

app.get('/info', (req,res) => {
  let date = new Date().toString()
  var query = Person.find();
query.count(function (err, count) {
    if (err) {console.log(err)}
    else {
      page = `<p>Phonebook has info for ${count} people</p> 
            <p>${date}</p>`
      res.send(page)
    }
})
    
    

    

})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
  .catch(error => next(error))
  })

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
    response.json(person)
    }
    else {
      response.status(404).end()
    }
  }).catch(error =>
    {next(error)
    })
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or number is missing' 
      })
    }

    

    const person = new Person( {
     name : body.name,
     number : body.number
    })
  
    person.save().then(savedPerson =>{
      response.json(savedPerson)
      console.log(savedPerson)
    })
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'validationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

