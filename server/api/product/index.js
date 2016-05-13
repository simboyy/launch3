'use strict';

var express = require('express');
var controller = require('./product.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();


router.get('/my', auth.isAuthenticated() , controller.myProducts);
router.get('/pub', auth.isAuthenticated() , controller.pubProducts);
router.get('/', controller.index);
router.get('/count', controller.count);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);



module.exports = router;
