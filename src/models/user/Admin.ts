/** @format */

import { STRING, INTEGER, Model } from "sequelize"
import database from "../../loaders/DBConnection"
import { User } from "./User"

export class Admin extends Model {
  public id!: number
  public userId!: number
  public username!: string
  //   TODO: Reference role model
}

Admin.init(
  {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: STRING,
      allowNull: false,
    },

    username: {
      type: STRING,
      allowNull: false,
    },
  },
  {
    sequelize: database,
  }
)

Admin.belongsTo(User, {
  as: "user",
  foreignKey: { allowNull: false, name: "userId" },
  onDelete: "DO NOTHING",
})
