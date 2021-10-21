//Starting point of Task manager applicaton
const express = require('express')
// const valdtor = require('validator')
//using below require to ensure mongoose runs and connect to db
require("./db/mongoose")
const User = require('./models/user')
const Task = require('./models/task')
const { update } = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

//Getting user data is 2 step process
//1) configuring express to parse incoming JSON
//2) use req.body in app.get/post call
app.use(express.json())

//# Create User  
app.post('/users', async (req, res) => {
    // Creating user
    //USING Async Await
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }


    //USING Promise
    // user.save().then(() => {
    //     //setting default values using res.send() call
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(400) //need to call before res.send() call
    //     res.send(error);
    // })

    //#Test region
    // res.send('Testing')
    //#endregion
})
//#endregion

// //#Fetching multiple users
app.get('/users', async (req, res) => {

    //USING Async Await
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send('Service is currently down')
    }

    //USING Promsie
    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((error) => {
    //     res.status(500).send('Service is currently down')
    // })
})
//#endregion

// //#Fetching a unique user
app.get('/users/:id', async (req, res) => {
    //req.params allow access to url parameters
    const _id = req.params.id
    // // console.log(req.params);

    //USING Async Await
    try {

        const fetched_user = await User.findById(_id)
        if (fetched_user) {
            res.status(200).send(fetched_user)
        } else {
            res.status(404).send('User not found')
        }

    } catch (error) {
        res.status(500).send('Internal error')
    }

    //USING Promise
    // //1) findone if searching by criteria
    // //2) findByID if searching by id
    // User.findById(_id).then((fetched_user) => {
    //     if (!fetched_user) {
    //         return res.status(404).send('User not found')
    //     }
    //     res.send(fetched_user)
    // }).catch((error) => {
    //     res.status(500).send('Internal error')
    // })

})
// //#endregion

//# Allowing user to update exisiting data
app.patch('/users/:id', async (req, res) => {

    //# Setting up rules when user attempts for an invalid update operation
    // every() provdie a callback fun for every item in array
    // Syntax: array.every((array_elemet) => {//do something})
    // if every fun return True for all elements in array, then it will return True 
    // otherwise False (even if there is one False)
    const updates = Object.keys(req.body) // Object.keys(object) will return array of strings
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidUpdateOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdateOperation) {
        return res.status(400).send({ error: 'Invalid Update operation' })
    }
    //#endregion

    try {
        // setting option new: true will return a new user 
        // and runValidators will validate new data
        const new_updated_user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!new_updated_user) {
            return res.status(404).send('User not found')
        }
        res.send(new_updated_user)
    } catch (error) {
        //Two cases:
        //1) Server related error
        //2) Validation error for eg: sometime try to update with null data
        // only handling validataion error
        res.status(400).send(error)
    }
})

// Delete user endpoint
app.delete('/users/:id', async (req, res) => {
    try {
        const deleted_user = await User.findByIdAndDelete(req.params.id)
        if (!deleted_user) {
            return res.status(404).send('User not found')
        }
        res.status(200).send(deleted_user)
    } catch (error) {
        res.status(500).send('Internal server error')
    }

})

//#Create a Task
app.post('/tasks', async (req, res) => {
    // Creating task
    const new_Task = new Task(req.body)

    //USING Async Await
    try {
        await new_Task.save()
        res.status(201).send(new_Task)
    } catch (error) {
        res.status(400).send(error)
    }

    //USING Promise
    // new_Task.save().then(() => {
    //     res.status(201).send(new_Task)
    // }).catch((error) => {
    //     res.status(400) //need to call before res.send() call
    //     res.send(error);
    // })

    //#Test region
    // console.log(new_Task);
    // res.send('Testing')
    //#endregion
})
//#endregion

// //#Fetching all task
app.get('/tasks', async (req, res) => {

    //USING Async Await
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send('Service is currently down')
    }
    //USING Promise
    // Task.find({}).then((fetched_tasks) => {
    //     res.send(fetched_tasks)
    // }).catch((err) => {
    //     res.status(500).send('Service is currently down')
    // })
})
// //#endregion

// //#Fetching a unique task by ID
app.get('/tasks/:id', async (req, res) => {
    // console.log(req.params)
    const _id = req.params.id

    //USIGN Async Await
    try {
        const task_by_Id = await Task.findById(_id)
        if (task_by_Id) {
            res.send(task_by_Id)
        } else {
            res.status('404').send('Task not found')
        }
    } catch (error) {
        res.status(500).send('Internal server error')
    }
    //USING Promsie
    // Task.findById(_id).then((unique_task) => {
    //     if (!unique_task) {
    //         return res.status(404).send('Task not found')
    //     }
    //     res.send(unique_task)
    // }).catch((err) => {
    //     res.status(500).send('Internal server error')
    // })
})
// //#endregion

// Allowing updates to tasks
app.patch('/tasks/:id', async (req, res) => {
    //# Checking if the request is for valid update 
    const updates = Object.keys(req.body)
    const alllowedUpdates = ['description', 'completed']
    const isValidUpdateOperation = updates.every((values) => alllowedUpdates.includes(values))
    if (!isValidUpdateOperation) {
        return res.status(400).send({ error: 'Invalid Update request' })
    }
    //#endregion

    try {
        const new_updated_task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!new_updated_task) {
            return res.status(404).send('Task not found')
        }
        res.send(new_updated_task)
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

// Delete task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const deleted_task = await Task.findByIdAndDelete(req.params.id)
        if (!deleted_task) {
            return res.status(404).send('Task not found')
        }
        res.status(200).send(deleted_task)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
})
app.listen(port, () => {
    console.log('Server is up on ' + port);
})
