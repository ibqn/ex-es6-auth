import Sequelize from 'sequelize'
import { sequelize as db } from '../db'


export const Twitter = db.define('twitter', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
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
  tableName: 'twitter',
})

export const syncTwitter = async () => {
  await Twitter.sync()
  console.log('table twitter is in sync')
}
