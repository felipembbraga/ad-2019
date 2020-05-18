import { Document, Model, Schema, model } from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    friend?: string;
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
    },
    friend: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});


UserSchema.statics.draw = async function (this: UserModel) {
    const users = await this.find().exec();
    if(users.length < 2) {
        throw new Error("Please, insert at least 2 users to draw.");
    }
    let notSortedUsers = [...users];

    for (let i = 0; i < users.length; i++) {
        // busca os participantes diferentes do atual
        const options = notSortedUsers.filter((u) => u._id !== users[i]._id);

        // Caso tenha sobrado apenas um usuário para escolher e for o mesmo da iteração atual, troca com outro
        if(options.length === 0) {
            const userIndex = Math.floor(Math.random() * users.length);
            users[i].friend = users[userIndex]._id;
            users[userIndex].friend = users[i]._id;
            notSortedUsers = notSortedUsers.filter((u) => u._id !== users[i]._id);
            continue;
        } 
        
        // sorteia um
        const index = Math.floor(Math.random() * options.length);
        console.log(index, options);
        // define como amigo
        users[i].friend = options[index]._id;

        // remove o sorteado dos participantes disponíveis
        notSortedUsers = notSortedUsers.filter((u) => u._id !== options[index]._id);

    }

    return await Promise.all(users.map((u) => u.save()));
};

const User: UserModel = model<User, UserModel>("User", UserSchema);

export default User;
