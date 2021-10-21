const express = require('express')
const router = new express.Router()
const Task = require('../models/task')


// #Test
// router.get('/test', (req, res) => {
//     res.send('Task Route from a new file')
// })
//#endregion

//#Create a Task
router.post('/tasks', async (req, res) => {
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

//#Fetching all task
router.get('/tasks', async (req, res) => {

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

//#Fetching a unique task by ID
router.get('/tasks/:id', async (req, res) => {
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
router.patch('/tasks/:id', async (req, res) => {
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
router.delete('/tasks/:id', async (req, res) => {
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



module.exports = router
