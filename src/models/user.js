import Sequelize from 'sequelize'
import { sequelize as db } from '../db'
import crypto from 'crypto'


const saltLen = 32
const iterations = 100000
const generateSalt = () => {
  const salt = crypto.randomBytes(saltLen)
  return salt.toString('hex')
}

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
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  salt: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: function () { return generateSalt() },
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
  tableName: 'user',
})

User.prototype.setPassword = async function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, iterations, saltLen, 'sha512')
  this.password = hash.toString('hex')
}

// checking if password is valid
User.prototype.validPassword = async function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, iterations, saltLen, 'sha512')
  const password_hash = hash.toString('hex')
  return this.password === password_hash
}

async function syncUser() {
  await User.sync()
  console.log('table is in sync')
}

syncUser().catch(error => {
  console.error(`Failed to create user table: ${error.stack}`)
  process.exit(1)
})
