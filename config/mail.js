const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const dotenv = require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        type : 'OAuth2',
        user : process.env.MAIL_USERNAME,
        clientId : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        refreshToken : process.env.GOOGLE_MAIL_REFRESH_TOKEN,
        accessUrl : 'https://oauth2.googleapis.com/token'
    }
})


const sendMailVerification = async (receiver,token) => {
    const mailOptions = {
        from: `"Anty Furniture" <${process.env.MAIL_USERNAME}>`,
        to: receiver,
        subject: 'Email Verification Anty Furniture',
        html: 
        `
        <div style="text-align: center; width : 70%; margin : auto">
            <p>Thank You for joining Anty Furniture, please use this token to verified your email</p>
            <h2 style="font-weight: bold;">${token}</h2>
            <h4 style="font-style: italic;">--Thank You, Anty Furniture--</h4>
        </div>
        `
    }
    const response = await transporter.sendMail(mailOptions)
    return response
}

const sendMailResetPassword = async (receiver,passToken) => {
    const mailOptions = {
        from: `"Anty Furniture" <${process.env.MAIL_USERNAME}>`,
        to: receiver,
        subject: 'Reset Password User Anty Furniture',
        html : 
        `
        <div style="text-align: center; width : 70%; margin : auto">
            <p>Oops, it seems that you're forget about your password, dont worry! use this token for reset your password</p>
            <h2 style="font-weight: bold;">${passToken}</h2>
            <h4 style="font-style: italic;">--Thank You, Anty Furniture--</h4>
        </div>
        `
    }
    const response = await transporter.sendMail(mailOptions)
    return response
}

module.exports = {
    sendMailVerification,
    sendMailResetPassword
}