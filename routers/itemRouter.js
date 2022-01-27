const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const mw = require('../tools/middleware');
const Item = require('../models/itemSchema');
const itemQueries = require('../queries/itemQueries');
const {param} = require('express/lib/request');

const itemRouter = express.Router();

const dest = path.join(__dirname, '../static/images');

function uploadFile(req, res, next) {
  const upload = multer({
    dest: dest,
    fileFilter: function(req, file, cb) {
      const ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return cb(new Error('Only images are allowed'));
      }
      cb(null, true);
    },
  }).single('image');

  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
    } else if (err) {
      return res.redirect('/');
    }
    next();
  });
}


itemRouter.get('/', function(req, res) {
  res.redirect('/');
});

itemRouter.get('/:id', async function(req, res) {
  const itemId = req.params.id;
  if (itemId) {
    try {
      const item = await Item.findOne({_id: itemId});
      if (item) {
        return res.render('item', {session: req.session, item: item});
      }
    } catch (err) {
      console.log(err);
    }
  }

  res.redirect('/');
});

itemRouter.post('/', mw.isAdmin, uploadFile, async function(req, res) {
  const params = {};
  Object.assign(params, req.body);

  if (!params.name || !params.description || !params.price || !params.quantity || !req.file) {
    if (req.file) {
      await fs.promises.unlink(path.join(dest, req.file.filename));
    }
    return res.redirect('/admin');
  }

  const ext = path.extname(req.file.originalname);
  params.imgExt = ext;

  const item = await itemQueries.addItem(params);

  const newFilename = item._id + ext;

  const oldPath = path.join(dest, req.file.filename);
  const newPath = path.join(dest, newFilename);

  await fs.promises.rename(oldPath, newPath);

  res.redirect(`/item/${item._id}`);
});

itemRouter.put('/:id', mw.isAdmin, uploadFile, function(req, res) {
  res.render('item', {session: req.session, item: null}); // TODO
});

itemRouter.delete('/:id', mw.isAdmin, function(req, res) {
  res.render('item', {session: req.session}); // TODO
});

module.exports = itemRouter;
