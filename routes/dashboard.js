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
  try {
  if (isIP(req.body.ip) && isPort(req.body.port)) {
    const ipPort = `${req.body.ip}:${req.body.port}`;
    await db('nodes')
    .insert({
      id: req.user.id,
      ip: ipPort
    })
    .where('id', req.user.id)
    .limit(1);
  } else {
    throw new Error(
      'Please enter a valid IP address.'
    );
  }
  let err = req.validationErrors();
  if (err) {
    throw err;
  }
  res.redirect('/');
  } catch (err) {
    req.flash('error', err.toString());
    console.log(err);
    res.redirect('/');  }
});

router.get('/deletenode/:index', permission(), async function(req, res, next) {
  const nodeArray = await getNodeArray(req);
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

function isIP(ipaddress) {  
  if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
    return true;  
  }  
  return false;  
}  
 
function isPort(port) {
  if(port > 0 && port <= 65535) {
    return true;
  }
  return false;
}
module.exports = router;