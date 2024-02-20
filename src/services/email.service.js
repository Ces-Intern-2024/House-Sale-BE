const { transporter, emailConfig } = require('../config/nodemailer.config')
const { BadRequestError, FailedDependenciesError } = require('../core/error.response')
const { userRepo } = require('../models/repo')

const htmlTemplate = ({ propertyId, name, email, phone, message }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Your property has received a new contact</h2>
        <table>
          <tr>
            <th>User</th>
            <th>Information</th>
          </tr>
          <tr>
            <td>Name</td>
            <td>${name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>${email}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>${phone}</td>
          </tr>
          <tr>
            <td>Message</td>
            <td>${message}</td>
          </tr>
          <tr>
            <td>Property</td>
            <td>${propertyId}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>`
}

const sendEmail = async ({ to, subject, text, html }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!to || typeof to !== 'string' || !emailRegex.test(to)) {
        throw new BadRequestError('Invalid or missing recipient email address')
    }

    const msg = { from: emailConfig.from, to, subject, text, html }
    const info = await transporter.sendMail(msg)
    if (!info.messageId) {
        throw new FailedDependenciesError('Error sending email')
    }

    return info
}

const sendContactEmailToSeller = async (contact) => {
    const { email: sellerEmail } = await userRepo.getUserById(contact.sellerId)
    const { propertyId, name, email, phone, message } = contact
    const subject = `NEW CONTACT FOR YOUR PROPERTY`
    const text = `Your property has been received new contact`
    const html = htmlTemplate({ propertyId, name, email, phone, message })

    const info = await sendEmail({ to: sellerEmail, subject, text, html })
    if (!info) {
        throw new FailedDependenciesError('Error occurred while sending email')
    }

    return info
}

module.exports = { sendContactEmailToSeller }