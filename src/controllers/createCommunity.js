import { Community, User, Role, Member } from '../models/models.js'; 
import { Snowflake } from "@theinternetfolks/snowflake";

const createCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    const owner = req.user.userId; // Get the owner's user ID from the authenticated user

   
    const slug = name.toLowerCase().replace(/ /g, '-');

    // Generate a Snowflake ID for the new community
    const communityId = Snowflake.generate();

  
    const community = new Community({
      _id: communityId, // Set the Snowflake-generated ID
      name,
      slug,
      owner,
      created_at: new Date(), 
      updated_at: new Date(), 
    });


    await community.save();

    
    const role = await Role.findOne({ name: 'Community Admin' }); 
    if (!role) {
      
      const roleId = Snowflake.generate(); 
      const newRole = new Role({
        _id: roleId,
        name: 'Community Admin',
      });
      await newRole.save();
    }

    const user = await User.findById(owner);

    // Create a member entry with the user, community, and the "Community Admin" role
    const memberid = Snowflake.generate()
    const member = new Member({
      _id: memberid,
      community: communityId,
      user: owner,
      role: role.id, 
    });

    await member.save();

    res.status(201).json({
      status: true,
      content: {
        data: {
          id: community._id,
          name: community.name,
          slug: community.slug,
          owner: community.owner,
          created_at: community.created_at,
          updated_at: community.updated_at, 
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default createCommunity;
