const { Sequelize } = require('sequelize');

/**
 * 线上：
 * nodejs_demo root Qwer1234
 * 本地：
 * localDemo local 12345
 * port: 3306
 */
// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "", DATABASE_NAME } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");


const sequelize = new Sequelize(DATABASE_NAME, MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: 'mysql', /* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
  operatorsAliases: false,
})


module.exports = sequelize
