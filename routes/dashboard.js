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
  if (nodeList[0].nodes === null) {
    console.log('null nodelist: ' + nodeList[0].nodes);
    res.render('dashboard', {
      title: 'Dashboard',
      nodes: JSON.parse('[]'),
      user: req.user ? req.user : undefined,
    });
  } else {
    console.log(nodeList);
    res.render('dashboard', {
      title: 'Dashboard',
      nodes: JSON.parse(nodeList[0].nodes),
      user: req.user ? req.user : undefined,
    });
  }
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
  if (oldNodeArray === null) {
    await db('users')
      .update({
        nodes: JSON.stringify(ipArray),
      })
      .where('id', req.user.id)
      .limit(1);
  } else {
  const modifiedArray = oldNodeArray.concat(ipArray);
  await db('users')
    .update({
      nodes: JSON.stringify(modifiedArray),
    })
    .where('id', req.user.id)
    .limit(1);
  }
  res.redirect('/');
});

router.get('/deletenode/:index', permission(), async function(req, res, next) {
  const delIndex = req.params.index;
  console.log('Request to delete index ' + delIndex + ', getting current node list...');
  const nodeList = await db('users')
  .select('nodes')
  .from('users')
  .where('id', req.user.id)
  .limit(1);
  console.log('Current node list retrieved: ' + JSON.stringify(nodeList));
  const oldNodeArray = JSON.parse(nodeList[0].nodes);
  console.log('Extracted old node array from database call: ' + oldNodeArray);
  oldNodeArray.splice(delIndex, 1);
  const modifiedArray = oldNodeArray;
  console.log('Removed requested index from array, new array: ' + modifiedArray);
  await db('users')
    .update({
      nodes: JSON.stringify(modifiedArray),
    })
    .where('id', req.user.id)
    .limit(1);
  console.log('Wrote modified array to database: ' + modifiedArray);
  res.redirect('/');
})
 
module.exports = router;