const nodeMailer = require('nodemailer')

let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,  //true for 465 port, false for other ports
    auth: {
        user: process.env.G_MAIL,
        pass: process.env.G_PASS
    }
});

const sendMail = async (email, name) => {

    try {
        let info = await transporter.sendMail({
            from: '"Aravind dev 👻" <testrockzs4@gmail.com>', // sender address
            to: `${email}`, // list of receivers
            subject: `${name}`, // Subject line
            text: "Hi from the developer world", // plain text body
            html: "<b>Hello world?</b>", // html body
        })
    }

    catch (e) {
        console.log(e);
    }

}


const cancelMail = async (email, name) => {

    try {
        let info = await transporter.sendMail({
            from: '"Aravind dev 👻" <testrockzs4@gmail.com>', // sender address
            to: `${email}`, // list of receivers
            subject: `${name}`, // Subject line
            text: 'Sorry to see you go', // plain text body
            // html: "<b>sorry to see go</b>", // html body
        })
    }

    catch (e) {
        console.log(e)
    }


}


module.exports = {
    sendMail,
    cancelMail
}