const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema(
    {

        description: {
            type: String,
            required: true
        },
        completion: {
            type: Boolean,
            default: false
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }, {
    timestamps: true
}

)


taskSchema.pre('save', (next) => {
    const task = this
    next()
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task