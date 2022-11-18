import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendEmailConfirmationMessage(email: string, frontHost:string) {
        const mailSubject = "Подтверждение пароля для API: homework2-six.vercel.app/api";
        const mailFrom = "Подтверждение пароля";
        const emailBody = "<b>Для подтверждения регистрации перейдите по этой <a href='http://" + frontHost + "/confirmation-registration'>Ссылке</a></b>";
        await emailAdapter.sendEmail(email, mailFrom, mailSubject, emailBody);
    }
}