const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require('axios')
const { init: initDB, Counter } = require("./db");

const logger = morgan("tiny");

const TT_APPID = 'tt4082363fdfbc782a01'
const TT_SECRET = '5e84800243a43c4b64a750d163b74d1060d25e53'


const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});



// 首页
app.get("/showInput", async (req, res) => {
  console.log(req.headers)
  res.send({
    code: 0,
    data: false,
  });
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

/**
 * platform 1：抖音、2快手
 */

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

const code2Session = async ({code, anonymousCode, platform=1}) => {
  let url = ''
  let reqdata = {}
  let reqHeader = {
      'Content-Type': 'application/json'
  }
  console.log('code2Session platform',platform, typeof platform);
  switch (platform) {
      case 1:
          url = 'https://developer.toutiao.com/api/apps/v2/jscode2session'
          reqdata = {
              appid: TT_APPID,
              secret: TT_SECRET,
              code, anonymousCode
          }
          break;
      case 2:
          url = `https://open.kuaishou.com/oauth2/mp/code2session?app_id=${KS_APPID}&app_secret=${KS_SECRET}&js_code=${code}`
          reqHeader['Content-Type'] = 'x-www-form-urlencoded'
          break;
      default:
          url = 'https://developer.toutiao.com/api/apps/v2/jscode2session'
          reqdata = {
              appid: TT_APPID,
              secret: TT_SECRET,
              code, anonymousCode
          }
          break;
  }
  const {data} = await axios({
      url,
      method: 'post',
      data: reqdata,
      headers: reqHeader
  })
  console.log('code2Session 请求的接口', url, data);
  return data
}


// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
