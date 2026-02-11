import nodemailer from "nodemailer"

import { env } from "../config/env.js"

const transporter = nodemailer.createTransport({

    host: env.SMTP_HOST,

    port: env.SMTP_PORT,

    auth: {

        user: env.SMTP_USER,

        pass: env.SMTP_PASS

    }

})

export async function sendContactMail(
    name: string,
    email: string,
    message: string
) {

    await transporter.sendMail({

        from: env.CONTACT_FROM,

        to: env.CONTACT_TO,

        subject: `Portfolio contact from ${name}`,

        text:
            `Name: ${name}
Email: ${email}

${message}`

    })

}
