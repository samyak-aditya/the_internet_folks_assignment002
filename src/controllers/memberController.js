import { User,Member,Role, Community } from '../models/models.js';





export const addMember = async (req, res) => {
    // Get the user's ID from the middleware
    const userId = req.user.userId;
  
    // Get the data from the request body
    const { community, user, role } = req.body;
  
    try {
      // Find the community using the provided community ID
      const communityDetails = await Community.findById(community).exec();
        console.log(communityDetails.owner.toString());
        console.log(userId+"<==============")
      if (!communityDetails) {
        return res.status(404).json({ message: 'Community not found' });
      }
  
      
      if (communityDetails.owner.toString() !== userId) {
        return res.status(403).json({ message: 'Access denied: Only Community Admin can add users.' });
      }
  
     
      const newMember = new Member({
        community: community,
        user: user,
        role: role,
      });
  
      
      const savedMember = await newMember.save();
  
      res.status(200).json({
        status: true,
        content: {
          data: savedMember,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };


  export const removeMember = async (req, res) => {
    
    const memberId = req.params.id;
    const userId = req.user.userId; 
  
    try {
     
      const member = await Member.findById(memberId).exec();
      const role = await Role.findById(member.role).exec();
      
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
       
      // Check if the user's ID matches the role ID in the member
      if (role.name !== "Community Admin" && role.name !== "Community Moderator") {
        return res.status(403).json({ message: 'Access denied: Only users with the matching role can remove this member.' });
      }
      
  
      // Remove the member from the database
      await Member.findByIdAndRemove(memberId).exec();
  
      res.status(200).json({
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  
  