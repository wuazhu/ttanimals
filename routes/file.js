var COS = require('cos-nodejs-sdk-v5');
const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage})
// const nanoid = require('nanoid').default

var cos = new COS({
    SecretId: 'AKIDpTqypPikcEZeT1HGyPZS5QUHm21jAMGt',
    SecretKey: 'NVLuCDxQcWAXd2C6j48vRgeMmvnUu3vX'
});


router.post('/saveFile', upload.any(), async (req, res) => {
    console.log('收到product test请求', req.files, typeof req.body, JSON.stringify(req.body));
    // console.log(nanoid());
    const fileId = `${req.files[0].fieldname}/${req.files[0].originalname}`
    cos.putObject({
        Bucket: '7072-prod-1ghj4mrl21347200-1309439117', /* 必须 */
        Region: 'ap-shanghai',     /* 存储桶所在地域，必须字段 */
        Key: fileId,              /* 必须 */
        StorageClass: 'STANDARD',
        Body: req.files[0].buffer, // 上传文件对象
        onProgress: function(progressData) {
            console.log(JSON.stringify(progressData));
        }
      }, function(err, data) {
        console.log(err || data);
        if (err) {
            res.send({
                code: -1,
                message: err
            })
        } else {
            
            if (data.statusCode == 200) {
                res.send({
                    data: {
                        url: data.Location.replace('7072-prod-1ghj4mrl21347200-1309439117.cos.ap-shanghai.myqcloud.com', 'https://7072-prod-1ghj4mrl21347200-1309439117.tcb.qcloud.la'),
                        fileid: fileId,
                        requestId: data.RequestId,
                    },
                    message: 'ok',
                    code: 0
                })
            }
        }
    });
})

router.post('/delete', async (req, res) => {
    console.log('请求删除问卷', req.body);
    if (!req.body.id) {
        res.send({
            code: -1,
            message: '参数错误'
        })
    } else {
        cos.deleteObject({
            Bucket: '7072-prod-1ghj4mrl21347200-1309439117', /* 必须 */
            Region: 'ap-shanghai',     /* 存储桶所在地域，必须字段 */
            Key: req.body.id,              /* 必须 */
        }, function(err, data) {
            if (err) {
                console.log('错误', err);
                res.send({
                    code: -1,
                    message: err.message
                })
            } else {
                console.log('成功',data);
                res.send({
                    code: 0,
                    message: 'ok',
                    data: {requestId: data.RequestId, statusCode: data.statusCode}
                })
            }
        })
    }
})


router.post('/test', (req, res) => {
    console.log('收到file test请求', req.body);
    
    res.send({
        message: 'file test',
        code: 0
    })
})

module.exports = router
