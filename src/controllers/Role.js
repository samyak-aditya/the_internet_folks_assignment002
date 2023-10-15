import {Role} from '../models/models.js';
import { Snowflake } from "@theinternetfolks/snowflake";

export const createRole = async (req, res) => {
  try {

    console.log(req.body);
    // Get the role name from the request body
    const { name } = req.body;
    console.log("+++++++++++++++++"+name);
    // Generate a unique ID for the role
    const roleId = Snowflake.generate();

    

    // Create a new role document
    const role = new Role({
      id: roleId,
      name,
      created_at: new Date(),
      updated_at: new Date(),
    });
    console.log(role)
   
    await role.save();


  
    res.status(201).json({
      status: true,
      content: {
        data: {
          id: role.id,
          name: role.name,
          created_at: role.created_at,
          updated_at: role.updated_at,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}




export const getAllRole = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    const totalRoles = await Role.countDocuments();
    const totalPages = Math.ceil(totalRoles / perPage);

    const roles = await Role.find({})
      .skip((page - 1) * perPage)
      .limit(perPage);

    const formattedRoles = roles.map(role => ({
      _id: role.id,
      name: role.name,
      created_at: role.created_at,
      updated_at: role.updated_at,
    }));

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalRoles,
          pages: totalPages,
          page: page,
        },
        data: formattedRoles,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};











