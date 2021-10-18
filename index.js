//Starting point of Task manager applicaton
const express = require('express')
//using below require to ensure mongoose runs and connect to db
require("./src/db/mongoose")
const User = require('./src/models/user')


const app = express()
const port = process.env.PORT || 3000

//Getting user data is 2 step process
//1) configuring express to parse incoming JSON
//2) use req.body in app.get/post call
app.use(express.json())

app.post('/users', (req, res) => {
    // Creating user
    const user = new User(req.body)
    user.save().then(() => {
        //setting default values using res.send() call
        res.send(user)
    }).catch(() => {

    })

    //#Test region
    // console.log(req.body);
    // res.send('Testing')
    //#endregion

})

app.listen(port, () => {
    console.log('Server is up on ' + port);
})
