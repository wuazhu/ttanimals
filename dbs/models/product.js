const {DataTypes} = require("sequelize");
const sequelize = require('../index');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  desc: {
    type: DataTypes.STRING,
  },
  // 下载的url
  configUrl: {
    type: DataTypes.STRING,
  },
  // 主图
  mainPicture: {
    type: DataTypes.STRING(10000),
  },
  // 详情图
  details: {
    type: DataTypes.STRING,
  },
  // 是否置顶
  isTop: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
})

module.exports = Product