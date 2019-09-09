/* eslint-disable no-unused-vars */
'use strict';

const { Router } = require('express');
const router = Router();

//Get home page
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Basic-auth' });
});

module.exports = router;
