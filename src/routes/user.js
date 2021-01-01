const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendMail, cancelMail } = require('../email/account')


const sharp = require('sharp')

const multer = require('multer')




const router = express.Router()


//Uploading files

const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("send a png,jgp,jpeg file"), false)
        }

        cb(null, true)
    }
})

//upload profile pic using buffer(binary)
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const Buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
    req.user.avatar = Buffer

    await req.user.save()

    res.send()
}, (error, req, res, next) => {
    if (error) {
        res.status(400).send({ error: error.message })
    }
    next()
})

//delete user profile pic avatar

router.delete('/users/me/avatar', auth, async (req, res) => {

    if (!req.user.avatar) {
        res.status(400).send("No picture to delete")
    }

    req.user.profile = null
    await req.user.save()
    res.send()

})


// get user profile avatar w/o auth


router.get('/users/:id/avatar', async (req, res) => {
    const user = await User.findById(req.params.id)

    try {
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')

        res.send(user.avatar)
    }

    catch (e) {
        res.status(404).send()
    }



})



router.delete('/users/me', auth, async (req, res) => {


    try {

        await req.user.remove()
        cancelMail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    }
    catch (e) {
        res.status(500).send()
    }



})


//login

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e);
        res.status(400).send()
    }

})


router.patch('/users/me', auth, async (req, res) => {

    const update = Object.keys(req.body)

    const allowedUpdates = ['name', 'email', 'password']

    const validoperation = update.every((value) => allowedUpdates.includes(value))

    if (!validoperation) {
        return res.status(400).send("invalid task update")
    }



    update.forEach((value) => {
        req.user[value] = req.body[value]
    })

    await req.user.save()

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    try {

        res.status(200).send(req.user)

    } catch (e) {

        res.status(500).send()

    }


})



// router.patch('/users/:id', async (req, res) => {

//     const update = Object.keys(req.body)

//     const allowedUpdates = ['name', 'email', 'password']

//     const validoperation = update.every((value) => allowedUpdates.includes(value))

//     if (!validoperation) {
//         return res.status(400).send("invalid task update")
//     }

//     const user = await User.findById(req.params.id)

//     update.forEach((value) => {
//         user[value] = req.body[value]
//     })

//     await user.save()

//     // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

//     try {

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)

//     } catch (e) {

//         res.status(400).send()

//     }


// })





//create
router.post('/users', async (req, res) => {
    const user = new User(req.body)


    try {
        await user.save()
        const token = await user.generateAuthToken()
        sendMail(user.email, user.name)
        res.status(201).send({ user, token })

    } catch (e) {

        res.status(400).send()
    }


})

router.get('/users/me', auth, async (req, res) => {

    // try {
    //     const users = await User.find({})
    //     res.status(200).send(users)
    // } catch (e) {

    //     res.status(500).send()

    // }


    res.send(req.user)

    // Task.find({}).then((tasks) => res.send(tasks)).catch((e) => res.status(500).send())
})


//logout

router.post('/users/logout', auth, async (req, res) => {

    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            token.token !== req.token
        })

        await req.user.save()

        res.status(200).send()

    }
    catch (e) {
        res.status(500).send()
    }

})

//logoutAll
router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }

    catch (e) {
        res.status(500).send()
    }

})


router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {

        const user = await User.findById({ _id })

        if (!user) {
            res.status(404).send()
        }

        res.status(200).send(user)

    } catch (e) {

        res.status(500).send()

    }
})

module.exports = router
