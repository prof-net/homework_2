import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(mail: string, mailFrom: string, mailSubject: string, emailBody: string) {
        let transporter = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
                user: 'send_mail_incubator@mail.ru', // generated ethereal user
                // pass: 'supermailer', // generated ethereal password
                pass: 'zQHBXWy8fYu8PzmXewz0', // generated ethereal password
            },
            tls: {
                ciphers:'SSLv3',
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: `${mailFrom} <send_mail_incubator@mail.ru>`,
            to: mail,
            subject: mailSubject,
            html: emailBody
        });
    }
}