/** @format */

import { STRING, Model, DATE, UUIDV4, CHAR } from "sequelize"
import Password from "../../helpers/Password"
import database from "../../loaders/DBConnection"

export class User extends Model {
  declare id: string
  declare email: string
  declare password?: string
  declare role: string
  declare emailVerifiedAt: Date
}

User.init(
  {
    id: {
      type: UUIDV4,
      defaultValue: UUIDV4,
      primaryKey: true,
    },

    email: {
      type: STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please add a valid email",
        },
      },
      set(value) {
        this.setDataValue("email", (value as string)?.trim().toLowerCase())
      },
    },

    password: {
      type: STRING,
      allowNull: false,
      validate: {
        notIn: {
          args: [["password", "1234567"]],
          msg: 'Password can not be or include sequence of "password" or "1234567"',
        },
        len: {
          args: [6, 15],
          msg: "Password must be at least between 6 - 15 characters.",
        },
      },
    },

    role: {
      type: CHAR(1),
      defaultValue: "u",
      allowNull: false,
      validate: {
        isIn: {
          args: [["u", "a"]],
          msg: "Valid values for 'role' are 'user(u)', and 'admin(a)'",
        },
      },
    },

    emailVerifiedAt: { type: DATE },
  },
  {
    sequelize: database,
    paranoid: true,
    tableName: "users",
    indexes: [
      {
        name: "email_index",
        using: "BTREE",
        fields: ["email"],
      },
    ],
  }
)

User.beforeCreate(async (user, options) => {
  const hashedPassword = Password.toHash(user.password!)
  user.password = hashedPassword
})
