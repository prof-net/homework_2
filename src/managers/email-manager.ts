import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendEmailConfirmationMessage(email: string, confirmationCode: string, frontHost:string) {
        const mailSubject = "Подтверждение пароля для API: homework2-six.vercel.app/api";
        const mailFrom = "Подтверждение пароля";
        // const emailBody = "<b>Для подтверждения регистрации перейдите по этой <a href='http://" + frontHost + "/confirmation-registration'>Ссылке</a></b>";
        const emailBody = `<h1>Thank for your registration</h1> <p>To finish registration please follow the link below: <a href='https://${frontHost}/confirm-email?code=your_confirmation_code?code=${confirmationCode}'>complete registration</a> </p>`;
        await emailAdapter.sendEmail(email, mailFrom, mailSubject, emailBody);
    }
}