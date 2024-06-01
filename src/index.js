// SETUPS
require('dotenv').config();
const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require("bcrypt");
const { UserModel, AnswerModel, ReviewModel } = require("./config");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});




const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://192.168.0.100:4200"); // Указываем домен клиентского приложения
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/browser', express.static(path.join(__dirname, 'browser')));

app.get('/iqAligner', (req, res) => {
    res.sendFile(path.join(__dirname, 'browser', 'index.html'));
});

app.get('/iqAligner/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'browser', 'index.html'));
});

function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Ошибка при удалении файла:', err);
        } else {
            console.log('Файл успешно удален');
        }
    });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, 'uploads');
        console.log(req.avatar);
        cb(null, dir);
     },
     filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
     }
});
function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Допустимы только изображения'));
    }
}
const fileSizeLimit = 10 * 1024 * 1024;

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: fileSizeLimit }
});


const port = 8000;
const host = '0.0.0.0';

// CHECKER
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    jwt.verify(token, 'secret key', (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        req.user = decoded;
        next();
    });
};

// GET
app.get("/api/profile/getUser", verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodeToken = jwt.verify(token, 'secret key');
        const userId = decodeToken.userId;

        const user = await UserModel.findById(userId);
        if(!user) {
            return res.status(404).send("User not found!");
        }
        const avatarUrl = `${req.protocol}://${req.get('host')}${user.avatar}`;

        res.status(200).send({
            ...user._doc,
            avatar: avatarUrl
        });
    } catch (e) {
        console.log(e);
        res.status(500).send("error data");
    }
});
// profile
app.get("/api/profile/getAnswers", verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;

        const userAnswers = await AnswerModel.find({ user: userId, aiAnswer: {$ne: null}});

        res.status(200).send(userAnswers);
    } catch (e) {
        res.status(404).send(`Error: ${e}`);
    }
});

// default 

app.get("/api/reviews/getReviews", async (req, res) => {
    try {
        const reviews = await ReviewModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: [{ $strLenCP: "$comment" }, 50] },
                            { $lte: [{ $strLenCP: "$comment" }, 500] }
                        ]
                    }
                }
            },
            { $sample: { size: 20 } }
        ]);
        
        const populatedReviews = await ReviewModel.populate(reviews, { path: 'user', select: 'username avatar' });

        const hostUrl = `${req.protocol}://${req.get('host')}`;

        const transformedReviews = populatedReviews.map(review => {
            if (review.user && review.user.avatar && !review.user.avatar.startsWith('http')) {
                review.user.avatar = `${hostUrl}${review.user.avatar}`;
            }
            return review;
        });

        res.status(200).send(transformedReviews);
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Ошибка при загрузке отзывов" });
    }
});
app.get("/api/reviews/getCount", async(req, res) => {
    try {
        const count = await AnswerModel.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Произошла ошибка при получении количества комментариев' });
    }
})





// POST

// reg - login
app.post("/api/reg", async (req, res) => {
    try {
        const data = {
            username: req.body.username,
            password: req.body.password,
            mail: req.body.mail,
            phone: req.body.phone,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            avatar: req.body.avatar,
        }
        const existingUser = await UserModel.findOne({ username: data.username });
        if (existingUser) {
            return res.status(500).send("Username занят!");
        } else {
            const saltRounds = 10;
            const hashedPass = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPass;

            const userData = await UserModel.insertMany(data);

            const user = await UserModel.findOne({ username: data.username });
            const token = jwt.sign({ userId: user._id }, 'secret key');
            console.log(userData);
            res.status(200).send({token});
        }
    } catch (e) {
        console.error(`Registration error: ${e}`);
        res.status(500).send(e || "Ошибка при регистрации");
    }


});
app.post("/api/login", async (req, res) => {
    try {
        const data = {
            username: req.body.username,
            password: req.body.password
        }
        const user = await UserModel.findOne({ username: data.username });

        if (!user) {
            return res.status(404).send("Такого логина не существует!");
        }

        const isValidPass = await bcrypt.compare(data.password, user.password);

        if (!isValidPass) {
            return res.status(404).send("Неправильный пароль!");
        }

        const token = jwt.sign({ userId: user._id }, 'secret key');

        res.status(200).send({ token });
    } catch (e) {
        res.status(500).send(`Error: ${e}`);
    }
});
// GPT 
const def = "Придумай 10 вопросов и отправь их в виде массива js";
app.post("/api/chat/start", verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Определять тип личности пользователя ( Меланхолик, Сангвинник, Холерик, Флегматик ) Так же определить профессии подходящие этому человку. " }, { role: "user", content: "Придумай 10 вопросов состоящих из минимум 15 слов до 30 довольно углубленных для опредления точного типа личности пользовтеля и по 4 варианта ответа для каждого и отправь их в виде json questions: [{question: вопрос (только вопрос без вариантов ответа в нем), answers: [4ответа]}"}],
            model: "gpt-3.5-turbo",
        });
        const questions = JSON.parse(completion.choices[0].message.content);
        const newAnswer = new AnswerModel({
            user: userId,
            questions,
        });
        await newAnswer.save();

        res.status(200).send({chatId: newAnswer._id, questions});
    } catch (e) {
        res.status(404).send(e || "error");
    }
});

app.post("/api/chat/getAnswer", verifyToken, async (req, res) => { // userAnswer, questions, chatId
    try {
        const userAnswer = req.body.userAnswer;
        const questions = req.body.questions;
        const chatId = req.body.chatId;

        if (userAnswer.length < questions.length) {
            return res.status(404).send("Not full answer!");
        };

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: `Определять тип личности пользователя ( Меланхолик, Сангвинник, Холерик, Флегматик ) Так же определить профессии подходящие этому человку. json {type: (тип личности), profession: (массив с подходящими профессиями от 10шт до 15шт), description: (описание типа личности 100+ слов), analysis: (подробный анализ ответов пользователя 200+ слов)}` }, { role: "user", content: ` Вот список вопросов = ${questions}. Вот ответы на эти вопросы: ${userAnswer}. ответ должен быть в виде json {type: (тип личности), profession: (массив с подходящими профессиями от 10шт до 15шт), description: (описание типа личности 100+ слов), analysis: (подробный анализ ответов пользователя 200+ слов)}` }],
            model: "gpt-3.5-turbo",
        });
        const updatedAnswer = await AnswerModel.findOneAndUpdate(
            { _id: chatId },
            { aiAnswer: JSON.parse(completion.choices[0].message.content), userAnswer: userAnswer },

            { new: true }
        );
        res.status(200).send(updatedAnswer.aiAnswer);
    } catch (e) {
        res.status(404).send(e || "error");
    }
});

app.post("/api/reviews/generateReview", verifyToken, async (req, res) => {
    try{
        const {grade} = req.body ?? 5;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: `Составлять отзыв от лица пользователя для сайта определяющего тип личности по оценке пользовател. Оценка пользователя = ${grade} из 5 (оценку в отзыве не упоминай, но пиши в зависимости от оценки). от 20 до 500 символов ответ должен быть в виде json = {review: string (max-length = 500)}` }, { role: "user", content: `Составь отзыв для сайта опредяющего тип личности и профессию с помощью ИИ по оценке пользователя в ${grade} баллов из 5.` }],
            model: "gpt-3.5-turbo",
        });

        const response = JSON.parse(completion.choices[0].message.content);
        console.log(response);
        
        res.status(200).send(response);
    }catch(e) {
        res.status(404).send(e || "ошибка при составлении отзыва");
    }
});

// Reviews 

app.post("/api/reviews/createReview", verifyToken, async(req, res) => {
    try {
        const {userId} = req.user;
        const {rating, comment} = req.body;
        const newReview = new ReviewModel({
            user: userId,
            rating,
            comment
        });

        await newReview.save();

        res.status(200).send({message: "Отзыв успешно опубликован!"});
    }catch(e) {
        console.error(e);
        res.status(500).send({message: "ошибка при добавлении комментария!"});
    }
});

// PUT

// profile
app.put("/api/profile/update", verifyToken, async (req, res) => {
    try {
        const { mail, firstName, lastName } = req.body;

        const {userId} = req.user;

        const user = await UserModel.findById(userId);

        if(!user) {
            return res.status(404).send("Пользователь не найден");
        }

        if (mail !== undefined) user.mail = mail;
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;

        await user.save();
        res.status(200).send({message: "Updated!"});
    } catch (e) {
        res.status(500).send("error");
    }
});

app.post("/api/profile/update-avatar", verifyToken, upload.single('avatar'), async(req, res) => {
    try{
        const { userId } = req.user;
        const avatarPath = `/uploads/${req.file.filename}`;

        const user = await UserModel.findById(userId);

        if(!user) {
            return res.status(404).send("Пользователь не найден");
        }
        if (user.avatar) {
            const previousAvatarPath = path.join(__dirname, user.avatar);
            deleteFile(previousAvatarPath);
        }
        user.avatar = avatarPath;
        await user.save();
        
        res.status(200).send({message: 'Аватар успешно обновлен'});
    }catch(e) {
        res.status(500).send('Ошибка при загрузке аватара');
    }
});


// delete

app.delete("/api/profile/removeAnswer", verifyToken, async (req, res) => {
    try {
        const {userId} = req.user;
        const answerId = req.body.answerId;

        const deletedAnswer = await AnswerModel.findById(answerId);
        if(!userId || !deletedAnswer) {
            res.status(404).send({message: "Пользователь или Ответ не найден"});
        }
        if(deletedAnswer.user.toString() !== userId) {
            res.status(410).send({message: "К сожалению у вас нет доступа"});
        }
        await AnswerModel.deleteOne(deletedAnswer);

        res.status(200).send({message: "Удалено!"}); 
    }catch (e) {
        console.error(e);
        res.status(500).send({message: "Ошибка при удалении ответа"});
    }
})




// Assistant

// async function startChat(userId) {
//     try{
//         const thread = await openai.beta.threads.create();
//         const newAnswer = new AnswerModel({
//             user: userId,
//             thread: thread.id
//         });

//         await newAnswer.save();
//         return newAnswer;
//     } catch(e) {
//         console.log(e);
//     }
// }
// async function getThreadFromDB(chatID){
//     try{
//         const chat = await AnswerModel.findOne({_id: chatID})
//         return chat;
//     }catch(e) {
//         console.log(e);
//         return null;
//     }
// }
// // Создать функцию для получения thread из бд.
// app.post("/api/chat/start", verifyToken, async(req, res) => {
//     try{
//         const { userId } = req.user;
//         await startChat(userId);
//         res.status(201).send("Chat Started!");
//     }catch(e) {
//         res.status(404).send(e || "Error");
//     }
// })

// app.post("/api/chat/sendMessage", verifyToken, async(req, res) => {
//     try{
//         const chat = await getThreadFromDB(req.body.chatID);
//         const user = req.user;
//         if(chat.user.toString() !== user.userId) {
//             return res.status(502).send("chat is not auth user");
//         }
//         // const run = await openai.beta.threads.runs.create(
//         //     chat.thread,
//         //     { assistant_id: "asst_HxCFyHcRdumF1T53UGaqqiXx" }
//         // );
//         console.log(123);

//         const sendMessage = await openai.beta.threads.messages.create(
//             chat.thread,
//             {role: "user", content: req.body.message}
//         )

//         res.status(200).send("good, message send!");
//     }catch(e){
//         res.status(500).send(e);
//     }
// })

//





const START = 0;
// START SERVER
app.listen(port, host, () => {
    console.log(`Server is running 🚀🚀🚀, port: ${port}`);
    console.log(`http://${host}:${port}/`);
});