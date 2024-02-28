const { transporter, emailConfig } = require('../config/nodemailer.config')
const { EMAIL_TEMPLATE } = require('../core/data.constant')
const { BadRequestError, FailedDependenciesError } = require('../core/error.response')
const { ERROR_MESSAGES } = require('../core/message.constant')
const { userRepo } = require('../models/repo')

const sendEmail = async ({ to, subject, text, html }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!to || typeof to !== 'string' || !emailRegex.test(to)) {
        throw new BadRequestError(ERROR_MESSAGES.SEND_EMAIL.INVALID_EMAIL)
    }

    const msg = { from: emailConfig.from, to, subject, text, html }
    const info = await transporter.sendMail(msg)
    if (!info.messageId) {
        throw new FailedDependenciesError(ERROR_MESSAGES.SEND_EMAIL.FAILED_TO_SEND_EMAIL)
    }

    return info
}

const sendContactEmailToSeller = async (contact) => {
    const { email: sellerEmail } = await userRepo.getUserById(contact.sellerId)
    const { propertyId, name, email, phone, message } = contact
    const subject = EMAIL_TEMPLATE.CONTACT_EMAIL_TO_SELLER.SUBJECT
    const text = EMAIL_TEMPLATE.CONTACT_EMAIL_TO_SELLER.TEXT
    const html = EMAIL_TEMPLATE.CONTACT_EMAIL_TO_SELLER.HTML({ propertyId, name, email, phone, message })

    return sendEmail({ to: sellerEmail, subject, text, html })
}

const sendVerificationEmail = async ({ userId, email }) => {
    const emailVerificationCode = await userRepo.generateEmailVerificationCode(userId)
    if (!emailVerificationCode) {
        throw new BadRequestError(ERROR_MESSAGES.USER.GENERATE_EMAIL_VERIFICATION_CODE)
    }

    const subject = EMAIL_TEMPLATE.VERIFICATION_EMAIL.SUBJECT
    const text = EMAIL_TEMPLATE.VERIFICATION_EMAIL.TEXT
    const verificationEmailUrl = `${emailConfig.prefixVerifyEmailUrl}/${userId}/${emailVerificationCode}`
    const html = EMAIL_TEMPLATE.VERIFICATION_EMAIL.HTML(verificationEmailUrl)

    return sendEmail({ to: email, subject, text, html })
}

const sendConfirmUpgradeSellerEmail = async ({ userId, email }) => {
    const emailVerificationCode = await userRepo.generateEmailVerificationCode(userId)
    if (!emailVerificationCode) {
        throw new BadRequestError(ERROR_MESSAGES.USER.GENERATE_EMAIL_VERIFICATION_CODE)
    }

    const subject = EMAIL_TEMPLATE.CONFIRM_UPGRADE_SELLER_EMAIL.SUBJECT
    const text = EMAIL_TEMPLATE.CONFIRM_UPGRADE_SELLER_EMAIL.TEXT
    const verificationEmailUrl = `${emailConfig.prefixVerifyEmailUrl}/${userId}/${emailVerificationCode}`
    const html = EMAIL_TEMPLATE.CONFIRM_UPGRADE_SELLER_EMAIL.HTML(verificationEmailUrl)

    return sendEmail({ to: email, subject, text, html })
}

const sendResetPasswordEmail = async ({ email, newPassword }) => {
    if (!email || !newPassword) {
        throw new BadRequestError(ERROR_MESSAGES.SEND_EMAIL.INVALID_EMAIL_ID_OR_PASSWORD)
    }

    const subject = EMAIL_TEMPLATE.RESET_PASSWORD_EMAIL.SUBJECT
    const text = EMAIL_TEMPLATE.RESET_PASSWORD_EMAIL.TEXT
    const html = EMAIL_TEMPLATE.RESET_PASSWORD_EMAIL.HTML(newPassword)

    return sendEmail({ to: email, subject, text, html })
}

module.exports = {
    sendResetPasswordEmail,
    sendConfirmUpgradeSellerEmail,
    sendVerificationEmail,
    sendContactEmailToSeller
}
