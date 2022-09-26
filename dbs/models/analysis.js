const {DataTypes} = require("sequelize");
const sequelize = require('../index');
const dayjs = require('dayjs')

const Analysis = sequelize.define('Analysis', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  talentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  nickName: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), 
  },
  openId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: dayjs().unix(),
  },
  playTimes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  platform: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  }
})

module.exports = Analysis