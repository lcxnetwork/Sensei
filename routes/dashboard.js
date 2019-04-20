// Copyright (c) 2019, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict';

const express = require('express');
const router = express.Router();
const permission = require('permission');
const db = require('../utils/utils').knex;

// Preference Panel
router.get('/', permission(), async function(req, res, next) {
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user ? req.user : undefined,
  });
});

router.post('/registernode', permission(), async function(req, res, next) {
  const ipPort = `${req.body.ip}:${req.bodyport}`;
  console.log(ipPort);
  await db('users')
    .update({
      nodes: ipPort,
    })
    .where('id', req.user.id)
    .limit(1);
  res.redirect('/');
});

module.exports = router;
