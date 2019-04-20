// Copyright (c) 2019, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const permission = require('permission')
const db = require('../utils/utils').knex

// Dashboard view
router.get('/', permission(), async function(req, res, next) {
  try {
    res.render('dashboard', {
      title: 'Dashboard',
      user: (req.user) ? req.user : undefined,
    })
  } catch (err) {
    next(err)
  }
})

router.post('/registernode', permission(), async function(req, res, next) {
  console.log(req.body)
  res.redirect('/')
})

module.exports = router
