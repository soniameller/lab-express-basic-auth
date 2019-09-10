/* eslint-disable no-unused-vars */
'use strict';

const { Router } = require('express');
const router = Router();

const routeGuardMiddleware = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
  } else {
    next();
  }
};

//Get home page
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Basic-auth' });
});

//TO go to the private page we have to be conected
router.get("/private", routeGuardMiddleware,(req, res, next) => {
  //routeGuardMiddleware checks if the user is connected
  const data = {
    // REVIEW should I save the user in locals 🤔? Dont remeber how to use it 
    user: req.session.currentUser
  };
    res.render("private", data);
});

router.get("/main", routeGuardMiddleware,(req, res, next) => {
  //routeGuardMiddleware checks if the user is connected
  const data = {
    // REVIEW should I save the user in locals 🤔? Dont remeber how to use it 
    user: req.session.currentUser
  };
    res.render("main", data);
});

router.get("/profile", routeGuardMiddleware,(req, res, next) => {
  
  const data = {
    // REVIEW should I save the user in locals 🤔? Dont remeber how to use it 
    user: req.session.currentUser
  };
    res.render("profile", data);
});

module.exports = router;
