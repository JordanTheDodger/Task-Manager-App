const mongoose = require('mongoose')
// const valdtor = require('validator')

// Task
const Task = mongoose.model('Task', {
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