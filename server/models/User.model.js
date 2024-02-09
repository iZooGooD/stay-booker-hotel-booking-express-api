import { DataTypes } from 'sequelize';
import db from './index.js';

const sequelize = db.sequelize;
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
});

export default User;
