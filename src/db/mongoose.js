const mongoose = require('mongoose')
const valdtor = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')



//Task
// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// // create task instance
// const new_Task = new Task({
//     description: '                      Learning Mongoose package                                                   ',
//     completed: false
// })

// //savng task instance
// new_Task.save().then(() => {
//     console.log(new_Task);
// }).catch((error) => {
//     console.log(error);
// })



