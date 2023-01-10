const express = require('express');
const connection = require('../connections');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
require('dotenv').config();

var auth = require('../services/authentification');
var checkRole = require('../services/checkRole');





router.post('/signupuser', (req, res, next) => {

    let users = req.body;
    const query = "select email,password,role,status from users where email=?"
    connection.query(query, [users.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                const query = "insert into users (name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
                connection.query(query, [users.name, users.contactNumber, users.email, users.password], (err, results) => {
                    if (!err) {
                        // return console.log(results);
                        return res.status(200).json({ message: "Successfully Register" });
                    } else {
                        //return console.log(err);
                        return res.status(500).json(err);
                    }
                });
            } else {
                return res.status(400).json({ message: "Email Already Exist" });
            }
        } else {
            return res.status(500).json(err);
        }

    })
});


router.post('/login', (req, res) => {
    let users = req.body;
    const query = "select email,password,role,status from users where email=?";
    connection.query(query, [users.email], (err, results) => {
        if (!err) {
            //email adress correcte or incorrecte
            if (results.length <= 0 || results[0].password != users.password) {
                return res.status(401).json({ message: "Incorrecte Username or password" });
            } else if (results[0].status === 'false') {
                return res.status(401).json({ message: "waith for Admin approval" });
            } else if (results[0].password == users.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accesstoken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '128h' })
                res.status(200).json({ token: accesstoken });
            } else {
                return res.status(400).json({ message: "Something went wrong!.Please try again later" });
            }
        } else {
            return res.status(500).json(err);
        }
    })
})


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: process.env.EMAIL,
            password: process.env.PASSWORD,
            clientId: '473862471783-m9us9srn5h1o8ht6vomadrkolu7otbm5.apps.googleusercontent.com',
            clientSecret: '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',
            refreshToken: '1//04qZ2E799wWjdCgYIARAAGAQSNwF-L9Ir0mReHd0Sm3hLdVbRGFhveA0Sx0C-qK37RMT6Ey0L4k0GJapn7DfnrRI3nelfUHCAseM'
        })

    }
});

router.post('/forgotpassword', (req, res) => {
    const users = req.body;
    const query = "select email,password from users where email=?";
    connection.query(query, [users.email], (err, results) => {
        if (!err) {
            //user does not exist in db
            if (results.length <= 0) {
                return res.status(200).json({ message: "Password sent successfully to your Email" });
            } else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'password by cafe management system',
                    html: '<p><b>Your Login details for cafe Management System</b><br><b>Email:</b>' + results[0].email + '<br><b>Password:</b>' + results[0].password + '<br><a href="http://localhost:4200/ser/login"></a> Click here to login</p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent:' + info.response);
                    }
                });
                return res.status(200).json({ message: "Password sent successfully to your Email" });
            }
        } else {
            return res.status(500).json(err);
        }
    })
})


router.get('/getuser', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var query = "select id,name,email,contactNumber,status from users where role='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

// update the user status
router.patch('/updateuser', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let users = req.body;
    const query = "update users set status=? where id=?";
    connection.query(query, [users.status, users.id], (err, results) => {
        if (!err) {
            //user is exist
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "user id does not exist" });
            }
            return res.status(200).json({ message: "user updated successfully" });
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/checkTolen', (req, res) => {
    return res.status(200).json({ message: "true" });
})

router.post('/changepassword',auth.authenticateToken,(req, res) => {
    const users = req.body;
    const email = res.locals.email;
    const query = "select * from users where email=? and password=?";
    connection.query(query, [email, users.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrecte Password" });
            } else if (results[0].password == users.oldPassword) {
                const query = "update users set password=? where email=?";
                connection.query(query, [users.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Password Updated Successfully." });

                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({ message: "Something went wrong. Please try again later" });
            }

        } else {
            return res.status(500).json(err);
        }
    })

})

module.exports = router;
