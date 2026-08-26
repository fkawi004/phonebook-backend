const dns = require('node:dns')
dns.setServers(['1.1.1.1', '8.8.8.8'])

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url =
  `mongodb+srv://k1:${password}@cluster0.ifcuafy.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)
  .then(() => {
    if (process.argv.length === 3) {
      return Person.find({})
        .then(persons => {
          console.log('phonebook:')

          persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
          })
        })
    }

    if (process.argv.length === 5) {
      const name = process.argv[3]
      const number = process.argv[4]

      const person = new Person({
        name,
        number
      })

      return person.save()
        .then(() => {
          console.log(`added ${name} number ${number} to phonebook`)
        })
    }

    console.log('usage:')
    console.log('node mongo.js password')
    console.log('node mongo.js password "name" number')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
  .finally(() => {
    mongoose.connection.close()
  })