const mongoose = require('mongoose')
// const valdtor = require('validator')


//defing Task Schema
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

//defining Task model
// Task
const Task = mongoose.model('Task', taskSchema)

// create Task(Schema) instance
// const new_Task = new Task({

//     completed: false
// })

// // saving task instance
// new_Task.save().then(() => {
//     console.log(new_Task);
// }).catch((error) => {
//     console.log(error);
// })

module.exports = Task