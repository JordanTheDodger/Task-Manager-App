const mongoose = require('mongoose')
const valdtor = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// defining Schema 
//Mongoose defines Schema behind the scenes
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
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
    },
    tokens: [{
        token: {
            type: String,
            requried: true
        }
    }]
})

//Generation auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'generateAuthToken') //user._id is obj so convert to string as jwt.sign(req:string)

    user.tokens = user.tokens.concat({ token }) // concat to tokens[]
    await user.save() // this will save em to db
    return token
}

// create your own using userSchema.statics.METHOD_NAME 
// set it as async arrow or normal function
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatchPwd = await bcrypt.compare(password, user.password)
    if (!isMatchPwd) {
        throw new Error('Unable to login')
    }

    return user
}

// Has the plain text password before saving
//Using Schema.pre() to perform hashing right before user update or save data
// need to use regular function syntax for the purpose of binding
// userSchema.pre('name_of_event', async fun(){})
//middleware => hasing pwd
userSchema.pre('save', async function (next) {
    const user = this

    // password hashing
    // console.log('just before saving');
    if (user.isModified('password')) {
        //isModified() will be true in 2case:
        //1) The user is created for 1st time
        //2) If user is updating pwd
        user.password = await bcrypt.hash(user.password, 8)
    }
    // run some code before and then call next() to ensure normal functioning
    next()
})

// defining User model
// User
const User = mongoose.model('User', userSchema)


//#Creating and Saving model instance
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
//#endregion


module.exports = User