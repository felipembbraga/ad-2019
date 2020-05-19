import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";
import sg from "nodemailer-sendgrid-transport";
import environment from "./environment";

const auth = {
    auth: {
        api_key: environment.email.mailgun.apiKey,
        domain: environment.email.mailgun.domain,
    },
};

const options = {
    auth: {
        // api_user: environment.email.sendgrid.username,
        api_key: environment.email.sendgrid.apiKey,
    },
};
export const sendgridSender = nodemailer.createTransport(sg(options));
const sender = nodemailer.createTransport(mg(auth));

export default sender;
