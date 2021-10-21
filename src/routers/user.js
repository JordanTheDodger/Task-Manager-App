const express = require('express')
const router = new express.Router()
const User = require('../models/user')

//#Test 
// router.get('/test', (req, res) => {
//     res.send('Route from a new file')
// })
//#endregion

//switching references from app to router as "app" does not exist in this file
//# Create User
router.post('/users', async (req, res) => {
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
router.get('/users', async (req, res) => {

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
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {

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
router.delete('/users/:id', async (req, res) => {
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


module.exports = router