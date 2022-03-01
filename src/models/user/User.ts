/** @format */

import { STRING, INTEGER, Model, DATE, UUID } from "sequelize"
import Password from "../../helpers/Password"
import database from "../../loaders/DBConnection"

export class User extends Model {
  public id!: string
  public email!: string
  public password?: string
  public role!: string
  public emailVerifiedAt?: Date
}

User.init(
  {
    id: {
      // TODO: Look into this UUID and the probability of not being unique
      type: UUID,
      autoIncrement: true,
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
        this.setDataValue("email", (value as string).trim().toLowerCase())
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
      set(value) {
        this.setDataValue("password", Password.toHash(value as string))
      },
    },

    role: {
      type: STRING,
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
    indexes: [
      {
        name: "email_index",
        using: "BTREE",
        fields: ["email"],
      },
    ],
  }
)
