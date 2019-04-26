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
  const nodeArray = await getNodeArray(req);
  res.render('dashboard', {
    title: 'Dashboard',
    nodes: nodeArray,
    user: req.user ? req.user : undefined,
  });
});

router.post('/registernode', permission(), async function(req, res, next) {
  const ipPort = `${req.body.ip}:${req.body.port}`;
  await db('nodes')
    .insert({
      id: req.user.id,
      ip: ipPort
    })
    .where('id', req.user.id)
    .limit(1);
  res.redirect('/');
});

router.get('/deletenode/:index', permission(), async function(req, res, next) {
  const nodeArray = await getNodeArray(req);
  console.log(req.user.id);
  console.log(nodeArray[req.params.index]);
  await db('nodes')
  .where({
  id: req.user.id,
  ip:  nodeArray[req.params.index]
  })
  .del();
  res.redirect('/');
})

async function getNodeArray(req) {
  let nodeArray = [];
  const nodeList = await db('nodes')
  .select('ip')
  .from('nodes')
  .where('id', req.user.id);
  nodeArray = nodeList.map(a => a.ip);
  return nodeArray;
}
 
module.exports = router;