import express from 'express';
import { Role } from '../models/models.js';
import { createRole,getAllRole } from '../controllers/Role.js';
const roleRouter = express.Router();


roleRouter.post('/',createRole );
roleRouter.get('/',getAllRole );


export {roleRouter};