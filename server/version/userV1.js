import express from 'express';
import { getAllUsers } from '../controllers/userController.js';

const user = express.Router();

user.get('/', getAllUsers);

export default user;
