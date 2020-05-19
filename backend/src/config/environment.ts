const environment = {
    mongodb: {
        url: process.env.MONGODB_URI || "mongodb://localhost/secretFriend",
    },
    server: {
        port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    },
    email: {
        mailgun: {
            apiKey: process.env.MAILGUN_API_KEY || "",
            domain: process.env.MAILGUN_DOMAIN || "",
        },
        sendgrid: {
            apiKey: process.env.SENDGRID_API_KEY || "",
            username: process.env.SENDGRID_USERNAME || "",
        },
    },
};

export default environment;
