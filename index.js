const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

morgan.token("body", (req) => JSON.stringify(req.body))
app.use(
    morgan(
        ":method :url :status :res['content-length'] :response-time[3] :body"
    )
)

app.use(cors())
app.use(express.static("build"))
app.use(express.json())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
]

app.get("/info", (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date().toISOString()}</p/`
    )
})

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find((person) => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.post("/api/persons", (req, res) => {
    const generateRandomId = (max) => Math.floor(Math.random() * max)
    const body = req.body
    console.log(body)
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "missing name or number",
        })
    }
    if (persons.map((person) => person.name).includes(body.name)) {
        return res.status(400).json({
            error: "name must be unique",
        })
    }
    const newPerson = {
        id: generateRandomId(1000000),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(newPerson)
    res.json(newPerson)
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter((person) => person.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
