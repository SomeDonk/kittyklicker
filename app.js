const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const router = express.Router();
var cookieParser = require("cookie-parser");
app.use(cookieParser());
const auth = require("./auth.js");

const SALT_WORK_FACTOR = 10;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/kittyklicker', {
    useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const infoSchema = new mongoose.Schema({
    kount: Number(),
    power: Number(),
    kost: Number(),
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    score: Number(),
    tokens: [],
});

userSchema.pre('save', async function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password'))
        return next();

    try {
        // generate a salt
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

        // hash the password along with our new salt
        const hash = await bcrypt.hash(this.password, salt);

        // override the plaintext password with the hashed one
        this.password = hash;
        next();
    }
    catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    }
    catch (error) {
        return false;
    }
};

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj.tokens;
    return obj;
}

userSchema.methods.addToken = function(token) {
    this.tokens.push(token);
}

userSchema.methods.removeToken = function(token) {
    this.tokens = this.tokens.filter(t => t != token);
}

userSchema.methods.removeOldTokens = function() {
    this.tokens = auth.removeOldTokens(this.tokens);
}

// model for each individual user
const User = mongoose.model('User', userSchema);

// Create a model for collective kitty data in the museum.
const Info = mongoose.model('Info', infoSchema);

// let kittykount = 0;
// let klickpower = 1;
// let klickupgradecost = 10;
const port = 4200

// app.get('/api/kittykount/:id', async(req, res) => {
//     console.log("in kittykount GET");

//     try {
//         let item = await Item.findOne({
//             _id: req.params.id
//         });

//         res.send(item.kount.toString());
//     }
//     catch (error) {
//         console.log(error);
//         res.sendStatus(500);
//     }
// });

// app.get('/api/klickpower/:id', async(req, res) => {
//     console.log("in klickpower GET");

//     try {
//         let item = await Item.findOne({
//             _id: req.params.id
//         });

//         res.send(item.power.toString());
//     }
//     catch (error) {
//         console.log(error);
//         res.sendStatus(500);
//     }
// });

app.get('/api/klickinfo', async(req, res) => {
    //console.log("in klickinfo GET");

    try {
        let items = await Info.find();
        res.send(items);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/api/start', async(req, res) => {
    const item = new Info({
        kount: req.body.kount,
        power: req.body.power,
        kost: req.body.kost
    });
    try {
        await item.save();
        res.send(item);
    }
    catch (error) {
        //console.log(error);
        res.sendStatus(500);
    }
});

app.post('/api/kittykount/:id/:userID', auth.verifyToken, async(req, res) => {
    try {
        let item = await Info.findOne({
            _id: req.params.id
        });
        let user = await User.findOne({
            _id: req.params.userID
        });
        console.log("in kittyklicked POST");
        item.kount += item.power;
        user.score += item.power;
        await item.save();
        await user.save();
        res.send({ kount: item.kount, kost: item.kost, power: item.power, user_score: user.score });
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/api/doublepower/:id', async(req, res) => {
    try {
        let item = await Info.findOne({
            _id: req.params.id
        });
        console.log("in doublepower POST");
        if (item.kount >= item.kost) {
            item.kount -= item.kost;
            item.power *= 2;
            item.kost *= 3;
            await item.save();
        }
        res.send({ kount: item.kount, kost: item.kost, power: item.power });
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// create a new user
app.post('/api/users', async(req, res) => {
    if (!req.body.username || !req.body.password)
        return res.status(400).send({
            message: "username and password are required"
        });


    try {

        //  check to see if username already exists
        const existingUser = await User.findOne({
            username: req.body.username
        });
        if (existingUser)
            return res.status(403).send({
                message: "username already exists"
            });

        // create new user
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            score: 0
        });
        await user.save();
        login(user, res);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// login
app.post('/api/users/login', async(req, res) => {
    if (!req.body.username || !req.body.password)
        return res.sendStatus(400);

    try {
        //  lookup user record
        const existingUser = await User.findOne({
            username: req.body.username
        });
        if (!existingUser)
            return res.status(403).send({
                message: "username or password is wrong"
            });

        // check password
        if (!await existingUser.comparePassword(req.body.password))
            return res.status(403).send({
                message: "username or password is wrong"
            });

        login(existingUser, res);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// Logout
app.delete("/api/users", auth.verifyToken, async(req, res) => {
    // look up user account
    const user = await User.findOne({
        _id: req.user_id
    });
    if (!user)
        return res.clearCookie('token').status(403).send({
            error: "must login"
        });

    user.removeToken(req.token);
    await user.save();
    res.clearCookie('token');
    res.sendStatus(200);
});

app.get('/api/users/all', async(req, res) => {
    try {
        let users = await User.find();
        res.send(users);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// Get current user if logged in.
app.get('/api/users', auth.verifyToken, async(req, res) => {
    // look up user account
    const user = await User.findOne({
        _id: req.user_id
    });
    if (!user)
        return res.status(403).send({
            error: "must login"
        });

    return res.send(user);
});

async function login(user, res) {
    let token = auth.generateToken({
        id: user._id
    }, "24h");

    user.removeOldTokens();
    user.addToken(token);
    await user.save();

    return res
        .cookie("token", token, {
            expires: new Date(Date.now() + 86400 * 1000)
        })
        .status(200).send(user);
}

app.listen(port, () => console.log('Server listening on port 4200!'));
