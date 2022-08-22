const express = require('express')
const router = express.Router()
const User = require('../dbs/models/user')

router.get('/test', (req, res) => {
    console.log('收到user test请求', req.body);
    res.send({
        message: 'user test',
        code: 0
    })
})


// 创建用户
router.get('/getUserInfoByOpenId', async (req, res) => {
    console.log('收到 getUserInfoByOpenId 请求', req.query);
    const {openid, platform} = req.query
    console.log('getUserInfoByOpenId', );
    const [user, created] = await User.findOrCreate({
        where: {openId: openid},
        defaults: {
            avatarUrl: 'https://7875-xuliehao-3g845nsk43d7c2ac-1309439117.tcb.qcloud.la/theme/default.jpg',
            nickName: '',
            gender: 1,
            platform
        }
    })
    console.log(
        '创建了用户或者查询',
        user, created)
    res.send(user.toJSON())

    // const _u = await User.findByPk(params.id)
    // if (!_u) {
    //     res.send({
    //         message: '没有该用户',
    //         code: -1
    //     })
    // } else {
    //     res.send({
    //         ..._u.toJSON(),
    //         message: 'ok',
    //         code: 0
    //     })
    // }
})

router.post('/userInfo', async (req, res) => {
    console.log('post userInfo 请求', req.body);
    const id = req.body.id
    if (!id) {
        res.send({
            code: -1,
            message: '缺少id'
        })
    } else {
        delete req.body.id
        const [updated] = await User.update({...req.body, aa: 13}, {
            where: {
                id
            }
        })
        if (!updated) {
            res.send({
                code: -1, 
                message: '更新用户信息失败'
            })
        } else {
            res.send({
                code: 0, 
                message: '更新用户信息成功'
            })
        }
    }
})

router.get('/token/:platform/:token', async (req, res) => {
    const {token, platform} = req.params
    const _u = await User.findOne({
        where: {
            token,
            platform
        }
    })
    console.log('查询user到的', _u);
    if (_u) {
        res.send({
            code: 0,
            message: '查询成功',
            ..._u.toJSON()
        })
    } else {
        res.send({
            code: -1,
            message: '查无此达人'
        })
    }

})

router.get('/top', async (req, res) => {
    const {platform} = req.query
    const _tops = await User.findAll({
        limit: 5,
        where: {
            platform,
            isHot: true,
            isTalent: true
        },
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

// 根据id查询用户
router.get('/:id', async (req, res) => {
    console.log('收到user请求', req.params);
    const {params} = req
    if (!params || !params.id) {
        res.send({
            message: '请输入用户id',
            code: -1
        })
    }

    const _u = await User.findByPk(params.id)
    if (!_u) {
        res.send({
            message: '没有该用户',
            code: -1
        })
    } else {
        res.send({
            ..._u.toJSON(),
            message: 'ok',
            code: 0
        })
    }
})
module.exports = router