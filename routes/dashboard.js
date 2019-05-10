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
  const lastSeenPromises = nodeArray.map(item => getLastShare(item));
  const lastSeen = await Promise.all(lastSeenPromises)
  const paymentsArray = await getPaymentsArray(req);

  res.render('dashboard', {
    title: 'Dashboard',
    nodes: nodeArray,
    payments: paymentsArray,
    lastseen: lastSeen,
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

async function getLastShare(ip) {
  const entireList = await db('pings')
    .select('*')
    .from('pings')
    .where('ip', ip);
  if (entireList.length === 0) {
    return 'Never';
  } else {
    return entireList[entireList.length - 1].timestamp
  }
}

function getNodeArray(req) {
  return db('nodes')
  .select('ip')
  .from('nodes')
  .where('id', req.user.id)
  .map(a => a.ip);
}

function getPaymentsArray(req) {
  return db('payments')
  .select('nonce', 'amount', 'hash')
  .from('payments')
  .where('id', req.user.id)
  .map(a => [convertTimestamp(a.nonce), a.hash, a.amount]);
}

// convert unix timestamp into human readable
function convertTimestamp(timestamp) {
  let d = new Date(parseInt(timestamp)), // Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
      dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
      hh = ('0' + d.getHours()).slice(-2), // Add leading 0
      min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
      time;
  // ie: 2013-02-18, 16:35
  time = yyyy + '-' + mm + '-' + dd + ', ' + hh + ':' + min;
  return time;
};
 
module.exports = router;