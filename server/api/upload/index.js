'use strict';

var express = require('express');
var controller = require('./upload.server.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.get('/', controller.index);
//router.get('/group', controller.group);
//router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:filename', controller.read);
//router.patch('/:id', auth.hasRole('admin'), controller.update);
//router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
