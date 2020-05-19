import nodemailer from "nodemailer";
import sg from "nodemailer-sendgrid-transport";
import environment from "./environment";


const options = {
    auth: {
        // api_user: environment.email.sendgrid.username,
        api_key: environment.email.sendgrid.apiKey,
    },
};
export const sendgridSender = nodemailer.createTransport(sg(options));

export default sendgridSender;
