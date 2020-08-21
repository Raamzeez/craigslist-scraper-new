const nodemailer = require('nodemailer')
const fs = require('fs')

const email = () => {
	const transporter = nodemailer.createTransport({
		service: 'outlook',
		auth: {
			user: 'raamizabbasi@outlook.com',
			pass: 'raamiz2003',
		},
	})

	fs.readFile('dataLogger.txt', (err, data) => {
		if (err) {
			return console.error(err)
		}
		const mailOptions = {
			from: 'raamizabbasi@outlook.com',
			to: 'raamizabbasi@gmail.com',
			subject: 'Copy of Requested Scraping Data',
			text: data,
		}

		transporter.sendMail(mailOptions, (err, info) => {
			err ? console.error(err) : console.log('Email sent: ' + info.response)
		})
	})
}

module.exports = email
