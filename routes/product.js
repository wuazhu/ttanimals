const express = require('express')
const router = express.Router()
const Product = require('../dbs/models/product')
const TopProduct = require('../dbs/models/topProduct')


router.get('/test', (req, res) => {
    console.log('收到product test请求', req.body);
    res.send({
        message: 'product test',
        code: 0
    })
})

router.get('/user/:id', async (req, res) => {
    if (!req.params.id) {
        res.send({
            message: `参数错误`,
            code: -1
        })
        return
    }
    const _products = await Product.findAll({
        where: {
            userId: req.params.id
        }
    })
    if (_products) {
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

router.get('/top', async (req, res) => {
    const _tops = await TopProduct.findAll({
        limit: 3,
        order: [
            [
                'sortId', 'ASC'
            ]
        ]
    })
    res.send({
        code: 0,
        message: 'ok',
        list: _tops
    })
})

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


module.exports = router