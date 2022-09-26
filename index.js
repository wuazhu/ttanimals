const express = require('express')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const sequelize = require('./dbs/index')
const schedule = require('node-schedule')


const {
  TT_ANIMAL_APPID,TT_ANIMAL_SECRET,KS_ANIMAL_APPID,KS_ANIMAL_SECRET,
  TT_THEME_APPID, TT_THEME_SECRET, KS_THEME_APPID, KS_THEME_SECRET
} = require('./config/index')

const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// 环境信息
const port = process.env.PORT || 80;

const User = require('./dbs/models/user')
const Product = require('./dbs/models/product')
const TopProduct = require('./dbs/models/topProduct')
const Play = require('./dbs/models/play')
const Analysis = require('./dbs/models/analysis')


User.hasMany(Product)
Product.belongsTo(User)

Product.hasOne(TopProduct)
TopProduct.belongsTo(Product)

User.hasMany(Play)
Play.belongsTo(User)

User.hasMany(Analysis)
Analysis.belongsTo(User)


// 数据库同步
sequelize.sync({
  alter: true
}).then(
  async result => {
    app.listen(port, () => {
      console.log(`服务启动了 start: http://localhost:${port}`);
    })
  }
)



app.get('/', async (req, res) => {
    console.log(req)
    res.sendFile(path.join(__dirname, "index.html"))
})

// 记录log
app.use('/', (req, res, next) => {
  console.log('时间戳', new Date().getTime(), req.headers);
  console.log();
  if (process.env.MYSQL_ADDRESS.indexOf('localhost') > -1) {
    next()
  } else {
    if (!(req.headers.referer && (req.headers.referer.includes('developer.toutiao.com') || req.headers.referer.includes('miniapi.ksapisrv.com')))) {
      res.send({
        code: 404,
        message: '非法请求'
      })
    } else {
      next()
    }
  }
})

app.use('/api/user', require('./routes/user'))
app.use('/api/product', require('./routes/product'))
app.use('/api/file', require('./routes/file'))
app.use('/api/play', require('./routes/play'))

app.get("/showInput", async (req, res) => {
    console.log(req.headers)
    res.send({
      code: 0,
      data: true,
    });
});

app.post('/getOpenId', async (req, res) => {
    console.log(req.body);
    try {
        const {code, anonymousCode, platform=1} = req.body
        if (platform == 1) {
          if (!code || !anonymousCode) {
              res.send({
                  code: -1,
                  message: '缺少code和anonymousCode'
              })
          }
        } else if (platform == 2) {
          if (!code) {
            res.send({
              code: -1,
              message: '缺少code'
            })
          }
        } else {
          if (!code || !anonymousCode) {
            res.send({
                code: -1,
                message: '缺少code和anonymousCode'
            })
          }
        }
        
        console.log('传过来的用户信息',req.body);
        const data = await code2Session(req.body)
        console.log('登录',data);
        if (platform == 1) {
            if (data.err_no == 0) {
                res.send({
                  ...data.data,
                  code: 0
                }) 
            } else {
                res.send({
                  ...data,
                  code: data.err_no
                })
            }
        } else if(platform == 2) {
            console.log('platformplatform进来了', data.result == 1);
            if (data.result == 1) {
                res.send({
                    code: 0,
                    openid: data.open_id,
                    ...data
                })
            } else {
                res.send({
                    code: data.result,
                    ...data
                })
            }
        }
    } catch (error) {
        res.send({
          ...error,
          code: -1
        }) 
    }
})

/**
 * 
 * @param {platform} number  1：tt 2：快手
 * @param {app} string 01：animal 2：theme
 * @returns login result
 */
const code2Session = async ({code, anonymousCode, platform=1, app}) => {
    let url = ''
    let reqdata = {}
    let reqHeader = {
        'Content-Type': 'application/json'
    }
    console.log('platform',platform, typeof platform);
    switch (platform) {
        case 1:
            url = 'https://developer.toutiao.com/api/apps/v2/jscode2session'
            reqdata = {
              code, anonymousCode,
            }
            if (app == '01') {
              reqdata.appid = TT_ANIMAL_APPID
              reqdata.secret = TT_ANIMAL_SECRET
            } else {
              reqdata.appid = TT_THEME_APPID
              reqdata.secret = TT_THEME_SECRET
            }
            break;
        case 2:
            let _appid = app == '01' ? KS_ANIMAL_APPID: KS_THEME_APPID
            let _sec = app == '01' ? KS_ANIMAL_SECRET: KS_THEME_SECRET
            url = `https://open.kuaishou.com/oauth2/mp/code2session?app_id=${_appid}&app_secret=${_sec}&js_code=${code}`
            reqHeader['Content-Type'] = 'x-www-form-urlencoded'
            break;
        default:
            url = 'https://developer.toutiao.com/api/apps/v2/jscode2session'
            reqdata = {
                appid: TT_ANIMAL_APPID,
                secret: TT_ANIMAL_SECRET,
                code, anonymousCode
            }
            break;
    }
    console.log('请求前的json数据', reqdata);
    const {data} = await axios({
        url,
        method: 'post',
        data: reqdata,
        headers: reqHeader
    })
    console.log('请求的接口', url);
    return data
}

const getAccessToken = async () => {
    const {data} = await axios({
        url: 'https://developer.toutiao.com/api/apps/v2/token',
        method: 'post',
        data: {
            appid: TT_ANIMAL_APPID,
            secret: TT_ANIMAL_SECRET,
            grant_type: 'client_credential'
        },
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return data
}

// 离线总计任务
// const job = schedule.scheduleJob('0 * * * * *', async function() {
const job = schedule.scheduleJob('0 0 0 * * *', async function() {
  console.log('每一分钟来一次')
  const allTalents = await User.findAll({
    where: {
        isTalent: true
    }
  })
  allTalents.forEach(async (talent, idx) => {
    const talentPlays = await Play.count({
      where: {
        talentId: talent.id
      }
    })
    let playData = {
      UserId: talent.id,
      openId: talent.openId,
      talentId: talent.id,
      nickName: talent.nickName,
      playTimes: talentPlays,
      platform: talent.platform,
    }

    
    const _create = await Analysis.create(playData)
    // console.log('是否创建播放离线表成功', _create)
  })
})
