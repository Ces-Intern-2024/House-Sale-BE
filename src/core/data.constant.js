const COMMON_EXCLUDE_ATTRIBUTES = {
    USER: ['password', 'emailVerificationCode']
}

const PAGINATION_DEFAULT = {
    USER: {
        LIMIT: 10,
        PAGE: 1,
        ORDER_BY: 'createdAt',
        SORT_BY: 'desc'
    },
    PROPERTY: {
        LIMIT: 10,
        PAGE: 1,
        ORDER_BY: 'createdAt',
        SORT_BY: 'desc'
    }
}

const ROUNDS_SALT = 10

const GOOGLE_API_URL = 'https://www.googleapis.com/oauth2'

const EMAIL_TEMPLATE = {
    CONTACT_EMAIL_TO_SELLER: {
        SUBJECT: 'NEW CONTACT FOR YOUR PROPERTY',
        TEXT: 'Your property has been received new contact',
        HTML: ({ propertyId, name, email, phone, message }) => {
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
    },
    VERIFICATION_EMAIL: {
        SUBJECT: 'VERIFY YOUR EMAIL',
        TEXT: 'Please verify your email address',
        HTML: (verificationEmailUrl) => {
            return `
            <html>
                <body>
                    <h1>Welcome New Seller to HOUSE SALE!</h1>
                    <p>Please click the button below to verify your email address:</p>
                    <a href="${verificationEmailUrl}" style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; margin: 15px 0; cursor: pointer; display: inline-block;">Verify Email</a>
                    <p>If you did not sign up for this account, you can ignore this email.</p>
                </body>
            </html>
        `
        }
    },
    CONFIRM_UPGRADE_SELLER_EMAIL: {
        SUBJECT: 'CONFIRM YOUR UPGRADE TO SELLER',
        TEXT: 'Please confirm your upgrade to seller by verifying your email address',
        HTML: (verificationEmailUrl) => {
            return `
            <html>
                <body>
                    <h1>Welcome New Seller to HOUSE SALE!</h1>
                    <p>Please click the button below to confirm your upgrade to seller:</p>
                    <a href="${verificationEmailUrl}" style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; margin: 15px 0; cursor: pointer; display: inline-block;">Confirm Upgrade</a>
                    <p> If you did not request to upgrade to seller, you can ignore this email.</p>
                    </body>
            </html>
        `
        }
    }
}

module.exports = {
    COMMON_EXCLUDE_ATTRIBUTES,
    ROUNDS_SALT,
    PAGINATION_DEFAULT,
    GOOGLE_API_URL,
    EMAIL_TEMPLATE
}
