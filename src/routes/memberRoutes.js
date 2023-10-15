import express from 'express';
import { checkAuth } from "../middleware/authMiddleware.js";
import { addMember, removeMember } from '../controllers/memberController.js';

const memberRouter = express.Router();


memberRouter.post('/',checkAuth,addMember );
memberRouter.delete('/:id',checkAuth, removeMember);





export default memberRouter;