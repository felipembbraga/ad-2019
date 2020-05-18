const environment = {
    mongodb: {
        url: process.env.MONGODB_URI || "mongodb://localhost/secretFriend"
    },
    server: {
        port: process.env.PORT ? parseInt(process.env.PORT) : 3000
    },
    email: {
        
    }

};

export default environment;
