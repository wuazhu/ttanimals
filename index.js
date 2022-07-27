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

// 获取头条openId
app.post('/getOpenId', async (req, res) => {
  console.log(req.body);
  try {
      const {code, anonymousCode} = req.body
      console.log('传过来的用户信息',req.body);
      if (!code || !anonymousCode) {
          return {
              code: -1,
              message: '请输入code和anonymousCode'
          }
      }
      const data = await code2Session(req.body)
      console.log('登录',data);
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
  } catch (error) {
      res.send({
        ...error,
        code: -1
      }) 
  }
})
const code2Session = async ({code, anonymousCode}) => {
  const {data} = await axios({
      url: 'https://developer.toutiao.com/api/apps/v2/jscode2session',
      method: 'post',
      data: {
          appid: TT_APPID,
          secret: TT_SECRET,
          code,
          anonymous_code: anonymousCode
      },
      headers: {
          'Content-Type': 'application/json'
      }
  })
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
