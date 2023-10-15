
import { Community, User, Member, Role } from '../models/models.js';


export const getAllCommunity = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    const totalCommunities = await Community.countDocuments();
    const totalPages = Math.ceil(totalCommunities / perPage);

    const communities = await Community.find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('owner', 'id'); 

    const result = await Promise.all(communities.map(async (community) => {
      // Fetch the owner's name using the owner's id
      const ownername = await User.findById(community.owner, 'name');

      return {
        id: community._id,
        name: community.name,
        slug: community.slug,
        owner: {
          id: community.owner, 
          name: ownername ? ownername.name : 'Unknown',
        },
        created_at: community.created_at,
        updated_at: community.updated_at,
      };
    }));

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalCommunities,
          pages: totalPages,
          page,
        },
        data: result,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};




 export const getAllMembers = async (req, res) => {
  try {
    const { id } = req.params; // Retrieve the community name from the dynamic parameter
  
    // Find the community based on the name
    const community = await Community.findOne({ slug: id });7
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const members = await Member.find({ community: community.id })
      .populate('user', 'id name') 
      .populate('role', 'id name'); 

    if (!members || members.length === 0) {
      return res.status(404).json({ message: 'Community has no members' });
    }

    // Format the response data
    const result = members.map((member) => ({
      id: member._id,
      community: member.community,
      user: {
        id: member.user.id, // Use 'id' instead of 'user' for the user ID
        name: member.user.name,
      },
      role: {
        id: member.role._id,
        name: member.role.name,
      },
      created_at: member.created_at,
    }));

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: members.length,
          pages: 1, // For simplicity, you can calculate pages if needed
          page: 1, // For the first page
        },
        data: result,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getMyOwnedCommunities = async (req, res) => {
  const itemsPerPage = 10;
  const page = parseInt(req.query.page) || 1; 
  const ownerId = req.user.userId;
  const communityAdminRoleName = 'Community Admin'; 
  console.log(ownerId)
  try {
    // Find the "Community Admin" role
    const adminRole = await Role.findOne({ name: communityAdminRoleName }).exec();
    console.log(adminRole); 
    if (!adminRole) {
      return res.status(404).json({ message: 'Community Admin role not found' });
    }

    // Find communities owned by the authenticated user and where their role matches "Community Admin"
    const ownedCommunities = await Community.find({ owner: ownerId })
      .populate({
        path: 'members',
        match: { role: adminRole._id },
      })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .exec();

  
    const total = ownedCommunities.length;

    // Calculate the total number of pages
    const totalPages = Math.ceil(total / itemsPerPage);

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          pages: totalPages,
          page,
        },
        data: ownedCommunities,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getJoinedCommunity = async (req, res) => {
  const itemsPerPage = 10;
  const page = parseInt(req.query.page) || 1; 
  const userId = req.user.userId; 

  try {
    // Find communities where the user is a member
    const userMemberships = await Member.find({ user: userId }).exec();


    const userCommunityIds = userMemberships.map((membership) => membership.community);

    
    const total = await Community.countDocuments({ _id: { $in: userCommunityIds } }).exec();

    // Calculate the total number of pages
    const totalPages = Math.ceil(total / itemsPerPage);

    
    const communities = await Community.find({ _id: { $in: userCommunityIds } })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .exec();

  
    const expandedCommunities = await Promise.all(
      communities.map(async (community) => {
        const owner = await User.findById(community.owner, 'id name').exec();
        return {
          ...community.toObject(),
          owner,
        };
      })
    );

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          pages: totalPages,
          page,
        },
        data: expandedCommunities,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
