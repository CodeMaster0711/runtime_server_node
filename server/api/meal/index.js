'use strict';

import {Router} from 'express';
import * as controller from './meal.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/user', auth.isAuthenticated(), controller.showusers);
router.post('/', auth.isAuthenticated(), controller.create);
router.get('/:id', auth.isOwner(), controller.show);
router.put('/:id', auth.isOwner(), controller.update);
router.delete('/:id', auth.isOwner(), controller.destroy);

module.exports = router;
