const express = require('express')
const router = express.Router()
const Product = require('../dbs/models/product')

// 根据用户id查询产品  C端
router.get('/user/:id', async (req, res) => {
    console.log('请求参数',req.body, req.params);
    if (!req.params.id) {
        res.send({
            message: `参数错误`,
            code: -1
        })
        return
    }
    const _products = await Product.findAll({
        where: {
            UserId: req.params.id
        }
    })
    if (_products.length > 0) {
        res.send({
            list: _products,
            message: `查询成功`,
            code: 0
        })
    } else {
        res.send({
            list: [],
            message: `暂无数据`,
            code: -1
        })
    }
    console.log('查询出的用户products', _products);
    
})

// 获取置顶产品  C端
router.get('/top', async (req, res) => {
    const _tops = await Product.findAll({
        limit: 3,
        where: {
            isTop: true
        },
        order: [
            [
                'createdAt', 'ASC'
            ]
        ]
    })
    
    res.send({
        code: 0,
        message: 'ok',
        list: _tops
    })
})

// 查询产品详情 C端
router.get('/detail/:id', async (req, res) => {
    if (!req.params.id) {
        res.send({
            code: -1,
            message: '参数错误'
        })
        return
    }
    const dtl = await Product.findByPk(req.params.id)
    console.log('详情',dtl);
    if (dtl) {
        res.send({
            ...dtl.toJSON(),
            code: 0,
            message: 'ok'
        })    
    } else {
        res.send({
            code: -1,
            message: '未查询到该产品'
        })
    }
})

// 创建产品 C端
router.post('/create', async (req, res) => {
    console.log('create', req.body);
    if (
        !req.body.userId || 
        !req.body.mainPicture || 
        !req.body.name ||
        !req.body.configUrl
    ) {
        res.send({
            code: -1,
            message: '参数错误'
        })
        return
    } else {
        const reqObj = {
            UserId: req.body.userId,
            name: req.body.name,
            desc: req.body.desc,
            mainPicture: req.body.mainPicture,
            configUrl: req.body.configUrl,
        }
        const prd = await Product.create(reqObj)
        // console.log('创建成功',reqObj, prd)
        res.send({
            code: 0,
            message: 'ok'
        })
    }
    // const dtl = await Product.findByPk(req.params.id)
    // console.log('详情',dtl);
    // if (dtl) {
    //     res.send({
    //         ...dtl.toJSON(),
    //         code: 0,
    //         message: 'ok'
    //     })    
    // } else {
    //     res.send({
    //         code: -1,
    //         message: '未查询到该产品'
    //     })
    // }
})



module.exports = router