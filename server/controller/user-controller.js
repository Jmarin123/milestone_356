const User = require('../model/users')
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

registerUser = async (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.email) {
        res.json({ error: true, message: 'Please enter all required fields.' }) //Bad request if it doesnt have username, password or email
    } else {
        const alreadyCreated = await User.findOne({ 'username': req.body.username });
        if (alreadyCreated) {
            //Throw error if user is created
            res.json({ error: true, message: 'Please enter a password of at least 8 characters.' });
        } else {
            const givenUUID = uuidv4();
            const encodedEmail = encodeURIComponent(req.body.email)
            const newUser = new User({ //This will create the user we need
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                isVerified: false,
                key: givenUUID,
            });
            //Saves to database
            await newUser.save();

            const transport = nodemailer.createTransport({
                sendmail: true,
                newline: 'unix',
                path: '/usr/sbin/sendmail'
            });
            insideText = 'http://goofy-goobers.cse356.compas.cs.stonybrook.edu/users/verify' + "?email=" + encodedEmail + "&key=" + givenUUID;
            console.log(insideText);
            transport.sendMail({
                from: 'root@goofy-goobers.cse356.compas.cs.stonybrook.edu',
                to: req.body.email,
                subject: 'verification link',
                text: insideText
            }, (err, info) => {
                console.log(err);
            });
            res.json({ error: false, status: 'OK' });
        }
    }
}

loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!email || !password) {
            return res.json({ error: true, message: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res.json({ error: true, message: "Wrong email or password provided." })
        }

        //^Checked for empty values(email/username/password) checked if values were incorrect, checked if user exist in db, if all cases passed now we login and create cookie session
        const options = {
            maxAge: 1000 * 60 * 15, //15 min timeout
        }
        if (getUser.isVerified == false) {
            return res.json({ error: true, message: "User needs to verify account first." });
        }
        res.cookie('username', username, options);
        res.cookie('password', password, options);
        res.json({ error: false, status: 'OK' });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    if (req.cookies) {
        if (req.cookies.username && req.cookies.password) { //Checking if there exists cookies for username and password
            res.clearCookie('username'); //Clearng our cookies
            res.clearCookie('password');
            res.json({ error: false, status: 'OK' })
        } else {
            res.json({ error: true, message: "Logout unsuccessful, cookies do not exist." });
        }
    } else {
        res.json({ error: false, message: "Unauthorized status code" });;
    }
}

verifyUser = async (req, res) => {
    const email = req.query.email;
    const key = req.query.key;
    //console.log(req.query);

    if (email && key) {
        const foundEmail = await User.findOne({ email: email });

        if (foundEmail && key === foundEmail.key) {
            //Finding our email
            if (foundEmail.isVerified == false) {
                await User.findOneAndUpdate({ 'email': email }, { isVerified: true }, { new: true }); //This finds the user based off email and updates!
                return res.json({ error: false, status: 'OK' });
            } else {
                //Email not in the system! Or is already verified
                return res.json({ error: true, message: 'User already verified!' });
            }
        } else {
            return res.json({ error: true, message: 'didnt find a user in the DB' });//If key doesnt match send a 400
        }
    } else {
        res.json({ error: true, message: 'Failed to get key and email!' });
    }
}

module.exports = {
    verifyUser,
    registerUser,
    loginUser,
    logoutUser
}