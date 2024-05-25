const mongoose = require("mongoose");
const database = module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try {
        mongoose.connect(`mongodb+srv://2ytka2:${process.env.DB_PASS}@cluster0.xj7m478.mongodb.net/iqAligner?retryWrites=true&w=majority&appName=Cluster0`);
        console.log('connect success! 🧠🧠🧠')
    } catch (error) {
        console.log(error);
    }

}

database();

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
        default: "/uploads/default.png",
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
        type: {},
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
