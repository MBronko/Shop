const express = require('express');
const mw = require('../tools/middleware');
const itemQueries = require('../queries/itemQueries');

// TODO use router
const itemRouter = express.Router();

itemRouter.get('/', function(req, res) {
  res.redirect('/');
});

itemRouter.get('/:id', function(req, res) {
  console.log(req.params);
  res.send(req.params.id);

  // res.render('item', {session: req.session}); // TODO
});

itemRouter.post('/', mw.isAdmin, function(req, res) {
  for (const key of ['name', 'description', 'price', 'quantity']) {
    if (!req.body[key]) {
      return res.render('item/menu');
    }
  }

  res.render('item', {session: req.session, item: null}); // TODO
});

itemRouter.put('/:id', mw.isAdmin, function(req, res) {
  res.render('item', {session: req.session, item: null}); // TODO
});

itemRouter.delete('/:id', mw.isAdmin, function(req, res) {
  res.render('item', {session: req.session}); // TODO
});

module.exports = itemRouter;
