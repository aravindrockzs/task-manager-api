const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;


const connectionURL = 'mongodb://127.0.0.1:27017'

const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useUnifiedTopology: true, useFindandModify: false }, (error, client) => {
    if (error) return console.log(error);

    console.log('connected correctly')

})



const db = client.db(databaseName);

// // db.collection('users').insertOne({
// //     'name': "test",
// //     'age': 24
// // }, (error, result) => {
// //     if (error) return console.log(error);
// //     console.log(result.ops);
// // })


// // db.collection('tasks').insertMany([{
// //     'description': "mongod",
// //     'completed': true
// // }, {
// //     'description': "mongo",
// //     'completed': true
// // }, {
// //     'description': "taskmanager",
// //     'completed': false
// // }], (error, result) => {
// //     if (error) return console.log(error)

// //     console.log(result.ops)
// // })

// // db.collection('tasks').find({ _id: new ObjectID("5fd0623729b658338c3d66b1") }).toArray((error, task) => {
// //     console.log(task)
// // })

// // db.collection('tasks').find({ completed: true }).toArray((error, task) => {
// //     console.log(task)
// // })

// // db.collection('tasks').updateMany({ completed: true }, { $set: { completed: false } })
// //     .then((result) => console.log("Update succesful"))

// db.collection('tasks').insertOne({
//     'description': "mongo",
//     'completed': true
// }).then((result) => console.log(result.modifiedCount))

// db.collection('tasks').deleteOne({ description: "mongo" }).then((result) => console.log(result.deletedCount))