const express = require('express')
const router = express.Router()
const User = require('../dbs/models/user')
const {Op} = require('sequelize')

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

// 更新用户信息
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

// 根据token查询用户
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

// 获取top用户
router.get('/top', async (req, res) => {
    const {platform=1} = req.query
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

// 设置top用户
router.post('/top', async (req, res) => {
    const {id, status} = req.body
    if (!id || status==null || status==undefined) {
        res.send({
            code: 0,
            message: '参数错误'
        })
    } else {
        console.log('设置top用户', id, status, !Number(status))
        const [_updateUser] = await User.update({
            isHot: !Number(status)
        }, {
            where: {
                id
            }
        })
        if (_updateUser) {
            res.send({
                code: 0,
                message: '修改成功'
            })
        } else {
            res.send({
                code: -1,
                message: '修改失败'
            })
        }
        console.log('_updateUser', _updateUser);
    }
})


router.get('/', async (req, res) => {
    const {platform, page=1, pageSize=10} = req.query
    const _pageSize = pageSize * 1
    const _page = page * 1
    const _offset = (_page-1)*pageSize

    const condition = {
        isTalent: false
    }
    if (platform) {
        condition.platform = platform
    }
    const _u = await User.findAll({
        limit: _pageSize,
        offset: _offset,
        where: condition,
        // order: [
        //     [
        //         // 'isTalent', 'ASC',
        //         'sortId', 'ASC'
        //     ]
        // ]
    })
    const _count = await User.count({
        where: {
            isTalent: false
        },
    })
    res.send({
        code: 0,
        message: 'ok',
        total: _count,
        list: _u
    })
})

// 获取达人
router.get('/talent', async (req, res) => {
    const {platform, page=1, pageSize=10, nickName} = req.query
    console.log('请求用户信息', req.query)
    const _pageSize = pageSize * 1
    const _page = page * 1
    const _offset = (page-1)*pageSize

    console.log(pageSize, _page, _offset,typeof pageSize, typeof _page, typeof _offset)
    
    const condition = {
        isTalent: true
    }
    if (platform) {
        condition.platform = platform
    }
    if (nickName) {
        condition.nickName = {
            [Op.like]: `%${nickName}%`
        }
    }
    console.log('条件', condition)
    const _u = await User.findAll({
        limit: _pageSize,
        offset: _offset,
        where: condition,
        // order: [
        //     [
        //         // 'isTalent', 'ASC',
        //         'sortId', 'ASC'
        //     ]
        // ]
    })
    res.send({
        code: 0,
        message: 'ok',
        list: _u
    })
})

// 修改达人
router.post('/talent', async (req, res) => {
    const {id, token} = req.body
    console.log('收到的',id, token)
    if (!id || !token) {
        res.send({
            code: 0,
            message: '参数错误'
        })
    } else {
        const [_updateUser] = await User.update({
            token,
            isTalent: true
        }, {
            where: {
                id
            }
        })
        if (_updateUser) {
            res.send({
                code: 0,
                message: '修改成功'
            })
        } else {
            res.send({
                code: -1,
                message: '修改失败'
            })
        }
        console.log('_updateUser', _updateUser);
    }
})

// 首页数据总览
router.get('/home', async (req, res) => {
    const dyUser = await User.count({
        where: {
            platform: 1,
        }
    })
    const ksUser = await User.count({
        where: {
            platform: 2,
        }
    })
    const dyTalent = await User.count({
        where: {
            platform: 1,
            isTalent: true
        }
    })
    const ksTalent = await User.count({
        where: {
            platform: 2,
            isTalent: true
        }
    })
    
    res.send({
        code: 0,
        data: {
            ttUser: dyUser,
            ksUser: ksUser,
            ttTalent: dyTalent,
            ksTalent: ksTalent,
        },
        message: 'ok'
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