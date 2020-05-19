import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";
import environment from "./environment";

const auth = {
    auth: {
        api_key: environment.email.apiKey,
        domain: environment.email.domain,
    },
};

const sender = nodemailer.createTransport(mg(auth));

export default sender;