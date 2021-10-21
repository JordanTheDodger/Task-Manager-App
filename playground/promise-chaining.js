// importing mongoose to connect to db
require('../src/db/mongoose')

const { count } = require('../src/models/user');
// importing user and task model
const User = require('../src/models/user')


// Find age by id and update it
//sample: 616daa2455654c0f6c257f02
//mongoose doc: 2 ways: 1) findByIdAndUpdate()
////////////////////////2) findOneAndUpdate() 
//reason: replaceOne, updateMany, and updateOne 
// does not return document but 1) & 2) does

// User.findByIdAndUpdate('616f1deea1a1f3826b753052', { age: 25 }).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 25 })
// }).then((user_count) => {
//     console.log(user_count);
// }).catch((error) => {
//     console.log(error);
// })

// Async await
//Remeber:
// only use async to a function
// only use await inside async function
const updateAgeandCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeandCount('616f1deea1a1f3826b753052', 27).then((count) => { console.log(count); }).catch((error) => { console.log(error); })