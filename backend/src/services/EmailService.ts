import  {sendgridSender} from "../config/email";
import { SendMailOptions } from "nodemailer";

class EmailService {
    sender = sendgridSender;
    fromEmail = "Amigo secreto<felipe.mendes.braga@gmail.com>";

    sendEmail = (options: SendMailOptions) =>
        new Promise((resolve, reject) => {
            this.sender.sendMail(options, (error: Error | null, info: any) => {
                if (error) {
                    return reject(error);
                }
                return resolve(info);
            });
        });

    notifyFriend = async (email: string, user: string, friendName: string) => {
        return await this.sendEmail({
            from: this.fromEmail,
            to: email,
            subject: "Sorteio do amigo secreto!",
            html: `<p>
        Olá ${user}, você tirou ${friendName} no amigo secreto!
        </p>`,
        });
    };
}

export default new EmailService();
