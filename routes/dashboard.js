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
  const nodeList = await db('users')
  .select('nodes')
  .from('users')
  .where('id', req.user.id)
  .limit(1);
  res.render('dashboard', {
    title: 'Dashboard',
    nodes: JSON.parse(nodeList[0].nodes),
    user: req.user ? req.user : undefined,
  });
});

router.post('/registernode', permission(), async function(req, res, next) {
  const ipPort = `${req.body.ip}:${req.body.port}`;
  const ipArray = [];
  ipArray.push(ipPort);
  console.log(ipArray);

  const nodeList = await db('users')
  .select('nodes')
  .from('users')
  .where('id', req.user.id)
  .limit(1);

  const oldNodeArray = JSON.parse(nodeList[0].nodes);
  console.log(oldNodeArray);

  const combinedArray = oldNodeArray.concat(ipArray);
  console.log(combinedArray);



  await db('users')
    .update({
      nodes: JSON.stringify(combinedArray),
    })
    .where('id', req.user.id)
    .limit(1);
  res.redirect('/');
});

module.exports = router;
