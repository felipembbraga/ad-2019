import { Document, Model, Schema, model } from "mongoose";

import emailValidator from "email-validator";
// import emailService from "../services/EmailService";

export interface User extends Document {
    name: string;
    email: string;
    friend?: string;
    notify(): Promise<any>;
}

export interface UserModel extends Model<User> {
    draw(): Promise<any>;
}

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email: string) => emailValidator.validate(email),
            message: (props) => `${props.value} is not a valid email.`,
        },
    },
    friend: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

UserSchema.methods.notify = async function (this: User) {
    await this.populate({path: "friend", select: "name email"}).execPopulate();
    console.log(this);
    try {
        // await emailService.notifyFriend()
    } catch (error) {
        
    }
};

UserSchema.statics.draw = async function (this: UserModel) {
    const users = await this.find().exec();
    if (users.length < 2) {
        throw new Error("Please, insert at least 2 users to draw.");
    }
    let notSortedUsers = [...users];
    const sortedUsers = [];

    for (let i = 0; i < users.length; i++) {
        // busca os participantes diferentes do atual
        const options = notSortedUsers.filter((u) => u._id !== users[i]._id);

        // Caso tenha sobrado apenas um usuário para escolher e for o mesmo da iteração atual, troca com outro
        if (options.length === 0) {
            const userIndex = Math.floor(Math.random() * sortedUsers.length);
            users[i].friend = sortedUsers[userIndex]._id;
            sortedUsers[userIndex].friend = users[i]._id;
            sortedUsers.push(users[i]);
            notSortedUsers = notSortedUsers.filter((u) => u._id !== users[i]._id);
            continue;
        }

        // sorteia um
        const index = Math.floor(Math.random() * options.length);
        console.log(index, options);
        // define como amigo
        users[i].friend = options[index]._id;
        sortedUsers.push(options[index]);

        // remove o sorteado dos participantes disponíveis
        notSortedUsers = notSortedUsers.filter((u) => u._id !== options[index]._id);
    }

    return await Promise.all(sortedUsers.map(async (u) => {
        await u.save();
        await u.notify();
        return u;
    }));
};

const User: UserModel = model<User, UserModel>("User", UserSchema);

export default User;
