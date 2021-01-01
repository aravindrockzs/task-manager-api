const express = require('express')

const auth = require('../middleware/auth')

const Task = require('../models/task')


const router = express.Router()

//All tasks without authentication

// router.get('/tasks', async (req, res) => {

//     const task = await Task.find({})

//     res.send(task)

// })






// GET '/tasks?completion=true'
// GET 'tasks?limit=2&skip=2,
// GET 'tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {

    const match = {}

    const sort = {}

    if (req.query.completion) {
        match.completion = req.query.completion === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }


    try {
        // const task = await Task.find({ owner: req.user._id })

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }

        }).execPopulate()

        res.status(200).send(req.user.tasks)
    } catch (e) {

        res.status(500).send(e)

    }

    // Task.find({}).then((tasks) => res.send(tasks)).catch((e) => res.status(500).send())
})


router.delete('/tasks/:id', auth, async (req, res) => {

    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    try {

        if (!task) {
            res.status(404).send("Task not found")
        }
        res.status(200).send(task)

    }
    catch (e) {

        res.status(500).send()

    }

})

router.patch('/tasks/:id', auth, async (req, res) => {

    const update = Object.keys(req.body)

    const allowedUpdates = ['name', 'completion', 'description']

    const validoperation = update.every((value) => allowedUpdates.includes(value))

    if (!validoperation) {
        return res.status(400).send("invalid task update")
    }

    // const task = await Task.findById(req.params.id)




    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    try {

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })



        if (!task) {

            return res.status(404).send()
        }

        update.forEach((value) => {
            task[value] = req.body[value]
        })

        await task.save()
        res.send(task)

    } catch (e) {

        res.status(400).send()

    }


})



router.post('/tasks', auth, async (req, res) => {

    try {

        const task = new Task({
            ...req.body,
            owner: req.user._id
        })

        await task.save()

        res.status(201).send(task)

    } catch (e) {

        res.send(400).send()
    }

    // task.save()
    //     .then((task) => {
    //         console.log(task)
    //         res.status(201).send(task)
    //     })
    //     .catch((e) => res.status(400).send(e))
})




router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {

        const task = await Task.findById({ _id })

        if (!task) {
            res.status(404).send()
        }

        res.status(200).send(task)

    } catch (e) {

        res.status(500).send()

    }



    // Task.findById({ _id }).then((task) => {
    //     if (!task) return res.status(404).send()

    //     res.send(task)
    // }).catch((e) => res.status(500).send())
})

module.exports = router