import express from 'express';
const versionUser = express.Router();
import user from "../version/userV1.js"

versionUser.use('/v1', user);

export default versionUser;
