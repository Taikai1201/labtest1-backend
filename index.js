const mongoose = require('mongoose')
const express = require('express')
const app = express()
app.use(express.json())
userRoute = require('./routes/UserRoutes')

// corss origin config
const cors = require('cors')
app.use(cors())

const SERVER_PORT = process.env.PORT || 8000

const DB_CONNECTION_STRING = "mongodb+srv://vudangdaiduong:Taikai1201@assignment1.ij06984.mongodb.net/labtest1?retryWrites=true&w=majority";

mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.route("/").get((req, res) => {
    res.send("<h1>hello</h1>")
})

app.use(userRoute)

app.listen(SERVER_PORT, () => {
    console.log(`Server running at http://localhost:${SERVER_PORT}`)
})