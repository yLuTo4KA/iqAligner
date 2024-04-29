const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/IQAligner");

connect.then(() => {
    console.log("DB connected! 🧠");
}).catch((e) => {
    console.log("⛔️⛔️⛔️DB NOT WORKING!⛔️⛔️⛔️", e);
});

// schemas 

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: false,
        default: null,
    },
    phone: {
        type: String,
        required: false,
        default: null,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
        default: null,
    },
    avatar: {
        type: String,
        required: false,
        default: null,
    }
})

const AnswerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    questions: {
        type: [String],
        required: true
    },
    aiAnswer: {
        type: JSON,
        required: false,
        default: null,
    },
    userAnswer: {
        type: [String],
        required: false,
        default: null,
    }
})

const UserModel = new mongoose.model("Users", UserSchema);
const AnswerModel = new mongoose.model("Answers", AnswerSchema);
module.exports = {UserModel, AnswerModel};
