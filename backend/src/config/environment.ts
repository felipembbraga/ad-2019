const environment = {
    mongodb: {
        url: process.env.MONGODB_URI || "mongodb://localhost/secretFriend"
    },
    server: {
        port: process.env.PORT ? parseInt(process.env.PORT) : 3000
    },
    email: {
        apiKey: process.env.MAILGUN_API_KEY || "",
        domain: process.env.MAILGUN_DOMAIN || "",
    }

};

export default environment;
