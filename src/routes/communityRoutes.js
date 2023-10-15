import express from 'express';
import  createCommunity  from "../controllers/createCommunity.js";
import { checkAuth } from "../middleware/authMiddleware.js";
import { getAllCommunity, getAllMembers , getJoinedCommunity, getMyOwnedCommunities } from "../controllers/getAllCommunityMembers.js";
const communityRouter = express.Router();


communityRouter.post('/',checkAuth, createCommunity);
communityRouter.get('/', checkAuth, getAllCommunity );
communityRouter.get('/me/member',checkAuth, getJoinedCommunity );  
communityRouter.get('/me/owner',checkAuth, getMyOwnedCommunities );
communityRouter.get('/:id/members', getAllMembers);

export default communityRouter;