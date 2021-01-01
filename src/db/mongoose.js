
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

// const Task = mongoose.model("Task", {
//     name: {
//         type: String
//     },
//     password: {
//         type: String,
//         required: true,
//         validate(value) {
//             if (!validator.isLength(value, { min: 7 })) {
//                 throw new Error("Password length must be greater than 6")
//             }
//         },

//     },
//     age: {
//         type: Number
//     }
// })


// const task = new Task({ name: 'Varman', password: 'pass@123', age: 23 });

// task.save().then(() => console.log(task)).catch((error) => console.log(error))