// requiring and connecting database
require('./db/mongoose')





const taskRouter = require('./routes/task')
const userRouter = require('./routes/user')

const express = require('express')

const app = express()




app.use(express.json())
app.use(taskRouter, userRouter)

const port = process.env.PORT


const multer = require('multer')

const upload = multer({
    dest: "images",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('not a doc or docx'), false)
        }

        cb(null, true)

    }

})


app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
})



app.listen(port, () => {
    console.log(`server is listening to ${port}`)
})




