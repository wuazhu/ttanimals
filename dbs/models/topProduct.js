const {DataTypes} = require("sequelize");
const sequelize = require('../index');

const TopProduct = sequelize.define('TopProduct', {
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
    type: DataTypes.TEXT,
  },
  // 主图
  mainPicture: {
    type: DataTypes.STRING,
    get() {
      return this.getDataValue('mainPicture').split(',')
    },
    set(value) {
      return this.setDataValue('mainPicture', value.join(','))
    },
  },
  isShow: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortId: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  // 详情图
  details: {
    type: DataTypes.STRING,
  },
})

module.exports = TopProduct