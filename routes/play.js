const express = require('express')
const router = express.Router()
// const User = require('../dbs/models/user')
const Analysis = require('../dbs/models/analysis')
// const Play = require('../dbs/models/play')
const {Op} = require('sequelize')
const sequelize = require('../dbs/index')

// 查询所有达人播放数据
router.get('/', async (req, res) => {
    console.log('请求参数',req.query);
    const {date, nickName, pageSize, current} = req.query
    let condition = {
        platform: req.query.platform || 1,
    }
    if (date) {
        condition.date = date
    }
    if (nickName) {
        condition.nickName = {
            [Op.like]: `%${nickName}%`
        }
    }
    const {count, rows} = await Analysis.findAndCountAll({
        where: condition,
        offset: (current - 1) * pageSize,
        limit: pageSize*1 || 10
    })
    
    console.log('播放', count)
    
    res.send({
        code: 0,
        list: rows,
        total: count,
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

// 结算某个日期
router.post('/calculate', async (req, res) => {
    const {ecpm, date, applyPv, realPv, platform} = req.body
    console.log('calculate', ecpm, date, applyPv, realPv, platform);
    if ( !ecpm || !date || !platform || !applyPv || !realPv) {
        res.send({
            code: -1,
            message: '参数错误'
        })
        return
    } else {
        
        // console.log(sequelize.col('co'))
        const allAnalysis = await Analysis.findAll({
            where: {
                date,
                platform
            }
        })
        if (allAnalysis.length > 0) {
            allAnalysis.forEach(async item => {
                const {id, ratio, playTimes} = item
                console.log('每一项', item)
                const _cost = playTimes * (realPv/applyPv) * ratio * (ecpm/1000)
                const [_upd, r] = await Analysis.update({
                    // 播放次数乘以 抖快给结算的真实播放次数 * 比例 * ecpm/1000
                    cost: _cost.toFixed(2)
                }, {
                    where: {
                        id,
                    }
                })
            })   
        }
        res.send({
            code: 0,
            message: 'ok'
        })
        // const reqObj = {
        //     UserId: req.body.userId,
        //     name: req.body.name,
        //     desc: req.body.desc,
        //     mainPicture: req.body.mainPicture,
        //     configUrl: req.body.configUrl,
        // }
        // const prd = await Product.create(reqObj)
        // // console.log('创建成功',reqObj, prd)
        // res.send({
        //     code: 0,
        //     message: 'ok'
        // })
    }
    
})



module.exports = router