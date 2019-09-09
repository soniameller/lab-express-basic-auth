/* eslint-disable no-unused-vars */
'use strict';

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const User = require("../models/user");

//To display the signup form
router.get("/signup", (req, res, next) => {
  res.render("authentication/signup");
});

//Handle the signup form submission
router.post("/signup", (req, res, next) => {
  let { username, password, confirmPassword } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("authentication/signup", {
      errorMessage: " Please enter a username and a password"
    });
    return; //to stop the function
  }

  //Check if the password is strong enough
  if (
    password.length < 7 ||
    !password.match(/[0-9]/) ||
    !password.match(/[A-Z]/)
  ) {
    res.render("authentication/signup", {
      errorMessage:
        " Your password should have more than 6 caracters, has to contain a digit and an uppercase letter"
    });
    return; //to stop the function
  }

  //Check if the user typed the same pasword twice
  if (password !== confirmPassword) {
    res.render("authentication/signup", {
      errorMessage: "You've entered two different passwords "
    });
    return; //to stop the function
  }

  User.findOne({ username: username }).then(user => {
    if (user) {
      res.render("authentication/signup", {
        errorMessage: "The username is already taken"
      });
    } else {
      User.create({
        username,
        password: hashPass
      })
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          //next of error goes to the error page. If it is just console.log it thinks forever
          next(error);
        });
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("authentication/login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("authentication/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ username: theUsername })
    .then(user => {
      if (!user) {
        res.render("authentication/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("authentication/login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

//TO go to the profile page we have to be conected
router.get("/profile", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("profile", {
      user: req.session.currentUser
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    // can't access session here
    res.redirect("/login");
  });
});

module.exports = router;
