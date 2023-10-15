
import { Schema, model } from 'mongoose';

import { Snowflake } from "@theinternetfolks/snowflake";


const userSchema = new Schema({
  _id: {
    type: String,
    required: true,
    default: Snowflake.generate,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now, 
  },
});


const communitySchema = new Schema({
  _id: {
    type: String,
    required: true,
    default: Snowflake.generate,
  },
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      user: {
        type: String,
        ref: 'User',
      },
      role: String,
    },
  ],
  slug: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true
    
  },
  created_at: {
    type: Date,
    required: true,
  },
  updated_at: {
    type: Date,
    required: true,
  },
});

const roleSchema = new Schema({
  _id: {
    type: String,
    required: true,
    default: Snowflake.generate,
  },
  name: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const memberSchema = new Schema({
  _id: {
    type: String,
    required: true,
    default: Snowflake.generate,
  },
  community: {
    type: String,
    required: true,
    ref: 'Community',
  },
  user: {
    type: String,
    required: true,
    ref: 'User',
  },
  role: {
    type: String,
    required: true,
    ref: 'Role',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});



export const Member = model('Member', memberSchema);
export const Role = model('Role', roleSchema);
export const User = model('User', userSchema);
export const Community = model('Community', communitySchema);
