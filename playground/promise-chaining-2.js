require('../src/db/mongoose')
const Task = require('../src/models/task')

//sample 616f22f8a309402940761c79

// Task.findByIdAndDelete('616f22f8a309402940761c79').then((remain_tasks) => {
//     console.log(remain_tasks);
//     return Task.countDocuments({ completed: false })
// }).then((new_tasks_count) => {
//     console.log('# of incomplete tasks=>  ' + new_tasks_count);
// }).catch((error) => {
//     console.log(error);
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count_task = await Task.countDocuments({ completed: false })
    return count_task
}

deleteTaskAndCount('616db7c2bc48f6887721589b').then((count) => { console.log('# of uncompleted tasks => ' + count); }).catch((error) => { console.log(error); })