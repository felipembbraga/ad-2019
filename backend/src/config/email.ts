import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";

const auth = {
    auth: {
        api_key: "8c36af1207b3adea2c570a0ef7d07431-e5e67e3e-5d8c1594",
        domain: "sandbox70be6f51a84e4d84abd568585e480a3a.mailgun.org",
    },
};

const sender = nodemailer.createTransport(mg(auth));

export default sender;