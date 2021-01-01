const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')




require('../db/mongoose.js')


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 8

        },

        email: {
            type: String,
            unique: true,
            required: true,
            validate(value) {
                if (!validator.isEmail(value)) {

                    throw new Error("Email not valid")
                }

            }

        },

        password: {
            type: String,
            minLength: 8,
            required: true

        },

        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],

        avatar: {
            type: Buffer
        }
    }, {
    timestamps: true
}
)


userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'

})

userSchema.methods.toJSON = function () {
    const user = this

    const protectuser = user.toObject()

    delete protectuser.password
    delete protectuser.tokens
    delete protectuser.avatar

    return protectuser

}


userSchema.methods.generateAuthToken = async function () {

    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token: token })

    await user.save()

    return token


}





userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("Unable to login")
    }

    const Match = await bcrypt.compare(password, user.password)

    console.log(Match);

    if (!Match) {
        throw new Error("Unable to login")

    }

    return user

}

userSchema.pre('save', async function (next) {
    const user = this

    const password = user.password

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)

        // to find whether the password matches with the hashed one 

        // const isMatch = await bcrypt.compare(password, user.password)
        // console.log(isMatch)
    }

    // console.log('Just before saving');

    next()
})

userSchema.pre('remove', async function (next) {
    const user = this

    const task = await Task.deleteMany({ owner: user._id })

    console.log(task);
    next()

})

const User = mongoose.model('User', userSchema)

module.exports = User;

// const user = new User({ name: "Andrew Mead 1", email: 'andrewmead1@gmail.com', password: "pass@1234" })

// user.save().then((user) => console.log(user)).catch((e) => console.log(e))