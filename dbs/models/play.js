const {DataTypes} = require("sequelize");
const sequelize = require('../index');
const dayjs = require('dayjs')

const Play = sequelize.define('Play', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  platform: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1, // 1: 抖音，2快手
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: dayjs().format('YYYY-MM-DD'), 
  },
  originDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: dayjs().unix(),
  },
  talentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  }
})

module.exports = Play