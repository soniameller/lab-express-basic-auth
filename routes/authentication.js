/* eslint-disable no-unused-vars */
'use strict';

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

//To display the signup form
router.get("/signup", (req, res, next) => {
  res.render("authentication/signup");
});

//Handle the signup form submission
router.post("/signup", (req, res, next) => {
  const { username, password, confirmPassword } = req.body;
  
  if (username === "" || password === "") {
    res.render("authentication/signup", {
      errorMessage: " Please enter a username and a password"
    });
    return; //to stop the function
  }
  //Check if the password is strong enough
  if ( 
    password.length < 7 ||
    !password.match(/[0-9]/) || //This regular expresion finds any character that is a digit
    !password.match(/[A-Z]/) // Finds any uppercase letter
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
  
  User.findOne({ username })
    .then(user => {
      if (user) {
        throw new Error("The username is already taken");
        // Would also work
        // return Promise.reject(new Error("The username is already taken"));
      } else {
        const bcryptSaltRounds = 10;
        return bcrypt.hash(password, bcryptSaltRounds);
      }
    })
    .then(hash => {
      return User.create({
        username,
        password: hash
      });
    })
    .then(user => {
      req.session.currentUser = user;
      res.redirect("/");
    })
    .catch(error => {
      const data = {
        errorMessage: error.message
      };
      res.render("authentication/signup", data);
    });
});

// REVIEW /authentication/login.hbs structure
router.get("/login", (req, res, next) => {
  res.render("authentication/login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("authentication/login", {
      errorMessage: "Please enter both, username and password to login."
    });
    return;
  }

  let auxiliaryUser;
  User.findOne({ username: theUsername }) 
  .then(user => {
    if (!user) {
      throw new Error("The username doesn't exist");
    } else {
      auxiliaryUser = user;
      return bcrypt.compareSync(thePassword, user.password);
    }
  })
  .then(match=> {
    if (!match) {
      throw new Error("Incorrect password");
    } else {
      req.session.currentUser = auxiliaryUser;
      res.redirect("/");
    }
  })
  .catch(error => {
    const data = {
      errorMessage: error.message
    };
    res.render("authentication/login", data);
  });
});


router.post("/logout", (req, res, next) => {
  req.session.destroy(err => {
    // can't access session here REVIEW. I can because it is in locals??
    res.redirect("/login");
  });
});

module.exports = router;
