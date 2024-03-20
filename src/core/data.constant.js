const { Op } = require('sequelize')
const db = require('../models')

const TIMEZONE = 'Asia/Ho_Chi_Minh'

const ROLE_NAME = {
    USER: 'User',
    SELLER: 'Seller',
    ADMIN: 'Admin'
}

const REPORT = {
    DEFAULT_DATE_RANGE: {
        FROM: () => new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
        TO: () => new Date()
    }
}

const TRANSACTION = {
    EXPENSE_DESC: {
        CREATE_NEW_PROPERTY: (message) => {
            return `Create new property!. ID: ${message}`
        },
        UPDATE_STATUS: (message) => {
            return `Update status property to Available!. ID: ${message}`
        }
    },
    DEFAULT_DATE_RANGE: {
        FROM: () => new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
        TO: () => new Date()
    },
    DEPOSIT_BY_ADMIN_DESC: 'Deposit credit by admin'
}

const SERVICES = {
    CREATE_NEW_PROPERTY: {
        NAME: 'Create New Property',
        ID: 1
    },
    RENTAL_DAY_ENUM: [15, 30, 60]
}

const COMMON_SCOPES = {
    feature: {
        model: db.Features,
        attributes: ['featureId', 'name'],
        as: 'feature',
        required: true
    },
    category: {
        model: db.Categories,
        attributes: ['categoryId', 'name'],
        as: 'category',
        required: true
    },
    location: {
        model: db.Locations,
        as: 'location',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        required: true
    },
    images: {
        model: db.Images,
        as: 'images',
        attributes: ['imageId', 'imageUrl'],
        required: true
    },
    seller: {
        model: db.Users,
        as: 'seller',
        attributes: ['userId', 'fullName', 'email', 'phone', 'avatar'],
        required: true
    }
}

const SCOPES = {
    PROPERTY: {
        GET_ALL: {
            User: ['feature', 'category', 'location', 'seller', 'images'],
            Seller: ['feature', 'category', 'location', 'images'],
            Admin: ['feature', 'category', 'location', 'seller', 'images']
        },
        GET: {
            User: ['feature', 'category', 'location', 'seller', 'images'],
            Seller: ['feature', 'category', 'location', 'images'],
            Admin: ['feature', 'category', 'location', 'seller', 'images']
        }
    }
}

const PROPERTY_STATUS = {
    AVAILABLE: 'Available',
    UNAVAILABLE: 'Unavailable',
    DISABLED: 'Disabled'
}

const PROPERTY_STATUS_PERMISSION = {
    GET_ALL: {
        User: 'Available',
        Seller: {
            [Op.or]: ['Available', 'Unavailable', 'Disabled']
        },
        Admin: {
            [Op.or]: ['Available', 'Unavailable', 'Disabled']
        }
    },

    GET: {
        User: 'Available',
        Seller: {
            [Op.or]: ['Available', 'Unavailable', 'Disabled']
        },
        Admin: {
            [Op.or]: ['Available', 'Unavailable', 'Disabled']
        }
    },

    UPDATE: {
        Seller: {
            [Op.or]: ['Available']
        },
        Admin: {
            [Op.or]: ['Available', 'Unavailable', 'Disabled']
        }
    },

    UPDATE_STATUS: {
        Seller: {
            [Op.or]: ['Available', 'Unavailable']
        },
        Admin: {
            [Op.or]: ['Available', 'Unavailable']
        }
    },

    DISABLED: {
        [Op.or]: ['Available', 'Unavailable']
    }
}

const COMMON_EXCLUDE_ATTRIBUTES = {
    USER: ['password', 'emailVerificationCode'],
    FEATURE: ['createdAt', 'updatedAt'],
    CATEGORY: ['createdAt', 'updatedAt'],
    PROPERTY: ['userId', 'featureId', 'categoryId', 'locationId']
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
    },
    TRANSACTION: {
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
                    <td><a href="https://house-sale-three.vercel.app/details//${propertyId}">Link to property ID: ${propertyId}</a></td>
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
    },
    RESET_PASSWORD_EMAIL: {
        SUBJECT: 'RESET YOUR PASSWORD',
        TEXT: 'Your password has been reset',
        HTML: (newPassword) => {
            return `
            <html>
                <body>
                    <h1>Your password has been reset</h1>
                    <p>Your new password is: <i style="color: red; font-size: 20px; font-weight: bold;"> ${newPassword}</i></p>
                    <p>If you did not request to reset your password, please contact us immediately.</p>
                </body>
            </html>
        `
        }
    }
}

module.exports = {
    REPORT,
    TIMEZONE,
    SERVICES,
    PROPERTY_STATUS,
    ROLE_NAME,
    PROPERTY_STATUS_PERMISSION,
    COMMON_SCOPES,
    TRANSACTION,
    SCOPES,
    COMMON_EXCLUDE_ATTRIBUTES,
    ROUNDS_SALT,
    PAGINATION_DEFAULT,
    GOOGLE_API_URL,
    EMAIL_TEMPLATE
}
