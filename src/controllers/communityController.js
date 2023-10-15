import { Request, Response } from 'express';
import { Community, User } from '../models/models';

export const getAllCommunityMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community
      .findById(id)
      .populate({
        path: 'members.user',
        select: 'id name',
      });

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const members = community.members.map(member => ({
      id: member._id,
      community: id,
      user: member.user,
      role: member.role,
      created_at: member.created_at,
    }));

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: members.length,
          pages: 1,
          page: 1,
        },
        data: members,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllCommunity = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    const totalCommunities = await Community.countDocuments();
    const totalPages = Math.ceil(totalCommunities / perPage);

    const communities = await Community.find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('owner', 'id name');

    const result = communities.map(community => ({
      id: community._id,
      name: community.name,
      slug: community.slug,
      owner: {
        id: community.owner._id,
        name: community.owner.name,
      },
      created_at: community.created_at,
      updated_at: community.updated_at,
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
