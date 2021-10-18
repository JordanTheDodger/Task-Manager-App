const mongoose = require('mongoose')
const validator = require('validator')

// defining a model
// User
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate(email_value) {
            if (!valdtor.isEmail(email_value)) {
                throw new Error('Email is invalid')
            }

        }
    },
    password: {
        type: String,
        require: true,
        minlength: 7,
        trim: true,
        validate(pwd_value) {
            if (pwd_value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain password')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        // required: true,
        validate(age_value) {
            if (age_value < 0) {
                throw new Error('Age cant be zero or negative number')
            }
        }
    }
})

// create model instance
// const new_User = new User({
//     name: 'J Sparrow',
//     age: 25,
//     email: 'JORDAN@gmail.com',
//     password: 'jadasjdasjdas@535132411241Sfasfa'
// })

// //saving model instance
// new_User.save().then(() => {
//     console.log(new_User)
// }).catch((error) => {
//     console.log('Error:', error);
// })


module.exports = User