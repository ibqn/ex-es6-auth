import Sequelize from 'sequelize'
import { sequelize as db } from '../db'
import crypto from 'crypto'


const keyLength = 32
const iterations = 100000
const digest = 'sha512'
const generateSalt = () => {
  const salt = crypto.randomBytes(keyLength)
  return salt.toString('hex')
}
const generateHash = (salt, password) => {
  const executor = (resolve, reject) => {
    const callback = (error, hash) => {
      if (error) {
        return reject(error)
      }

      resolve(hash.toString('hex'))
    }

    crypto.pbkdf2(password, salt, iterations, keyLength, digest, callback)
  }

  return new Promise(executor)
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
    defaultValue: () => generateSalt(),
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
  this.password = await generateHash(this.salt, password)
}

// checking if password is valid
User.prototype.validPassword = async function (password) {
  const hash = await generateHash(this.salt, password)
  return this.password === hash
}

async function syncUser() {
  await User.sync()
  console.log('table user is in sync')
}

syncUser().catch(error => {
  console.error(`Failed to create user table: ${error.stack}`)
  process.exit(1)
})
