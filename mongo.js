const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = ``

const personSchema = new mongoose.Schema({
name: String,
number: String
})

const Person = mongoose.model('Person', personSchema)

console.log("yhdistetään")

if (process.argv.length === 5) {
    mongoose.connect(url)
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
    })

    person.save().then(result => {
    console.log(`added ${result} to phonebook`)
    mongoose.connection.close()
    })
}
if (process.argv.length === 3) {
    console.log("Puhelinluettelo")
    mongoose.connect(url)
    Person.find({}).then(result => {
        result.forEach(p => {
          console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
      })
}
