import Sequelize from 'sequelize'
import { sequelize as db } from '../db'


export const User = db.define('user', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: Sequelize.UUIDV4
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    //defaultValue: null,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    //defaultValue: null,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
},
{
  timestamps: true,
  underscored: true,
  paranoid: true,
  freezeTableName: true,
  tableName: 'user'
})

async function syncUser() {
  await User.sync()
  console.log('table is in sync')
}

syncUser().catch(error => {
  console.error(`Failed to create user table: ${error.stack}`)
  process.exit(1)
})
