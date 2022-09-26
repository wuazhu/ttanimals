const express = require('express')
const router = express.Router()
const User = require('../dbs/models/user')
const Analysis = require('../dbs/models/analysis')
const Play = require('../dbs/models/play')
const dayjs = require('dayjs')

// 查询所有达人播放数据
router.get('/', async (req, res) => {
    console.log('请求参数',req.query);
    const {date, nickName} = req.query
    let condition = {
        platform: req.query.platform || 1
    }
    if (date) {
        condition.date = date
    }
    if (nickName) {
        condition.nickName = nickName
    }
    const dayPlays = await Analysis.findAll({
        where: condition
    })
    console.log('播放',dayPlays)
    
    res.send({
        code: 0,
        list: dayPlays,
        message: 'ok'
    })
    // if (!req.params.id) {
    //     res.send({
    //         message: `参数错误`,
    //         code: -1
    //     })
    //     return
    // }
    // const _products = await Product.findAll({
    //     where: {
    //         UserId: req.params.id
    //     }
    // })
    // if (_products.length > 0) {
    //     res.send({
    //         list: _products,
    //         message: `查询成功`,
    //         code: 0
    //     })
    // } else {
    //     res.send({
    //         list: [],
    //         message: `暂无数据`,
    //         code: -1
    //     })
    // }
    // console.log('查询出的用户products', _products);
    
})

// const job = schedule.scheduleJob('0 * * * * *', function() {
//     console.log('每一分钟来一次')
// })

// 创建产品 C端
// router.post('/create', async (req, res) => {
//     console.log('create', req.body);
//     if (
//         !req.body.userId || 
//         !req.body.mainPicture || 
//         !req.body.name ||
//         !req.body.configUrl
//     ) {
//         res.send({
//             code: -1,
//             message: '参数错误'
//         })
//         return
//     } else {
//         const reqObj = {
//             UserId: req.body.userId,
//             name: req.body.name,
//             desc: req.body.desc,
//             mainPicture: req.body.mainPicture,
//             configUrl: req.body.configUrl,
//         }
//         const prd = await Product.create(reqObj)
//         // console.log('创建成功',reqObj, prd)
//         res.send({
//             code: 0,
//             message: 'ok'
//         })
//     }
//     // const dtl = await Product.findByPk(req.params.id)
//     // console.log('详情',dtl);
//     // if (dtl) {
//     //     res.send({
//     //         ...dtl.toJSON(),
//     //         code: 0,
//     //         message: 'ok'
//     //     })    
//     // } else {
//     //     res.send({
//     //         code: -1,
//     //         message: '未查询到该产品'
//     //     })
//     // }
// })



module.exports = router