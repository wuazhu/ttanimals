const {DataTypes} = require("sequelize");
const sequelize = require('../index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nickName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING
    // allowNull 默认为 true
  },
  // 是否达人用户
  isTalent: {
    type: DataTypes.BOOLEAN,
    allowNull: false, // 默认为 true
    defaultValue: false
  },
  // 是否热门用户
  isHot: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  avatarUrl: {
    type: DataTypes.STRING,
    defaultValue: 'https://7875-xuliehao-3g845nsk43d7c2ac-1309439117.tcb.qcloud.la/theme/default.jpg',
    // allowNull 默认为 true
  },
  // 排序id
  sortId: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  openId: {
    type: DataTypes.STRING
  },
  gender: {
    type: DataTypes.INTEGER,
    // allowNull: true
    // defaultValue: 1
  },
  platform: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1, // 1: 抖音，2快手
  },
})

module.exports = User