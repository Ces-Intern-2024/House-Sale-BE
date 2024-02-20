require('dotenv').config
const nodemailer = require('nodemailer')

const emailConfig = {
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    },
    from: process.env.EMAIL_FROM
}

const transporter = nodemailer.createTransport({
    host: emailConfig.smtp.host,
    port: emailConfig.smtp.port,
    secure: true,
    secureConnection: false,
    auth: {
        user: emailConfig.smtp.auth.user,
        pass: emailConfig.smtp.auth.pass
    },
    tls: {
        rejectUnauthorized: true
    }
})

transporter
    .verify()
    .then(() => {
        console.log(`Connected Nodemailer`)
    })
    .catch((err) => {
        console.log(`Unable to connect to Nodemailer`, err)
    })

module.exports = { emailConfig, transporter }
