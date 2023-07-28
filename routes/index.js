var express = require('express');
var router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { content: '', session:req.session });
});

module.exports = router;

router.post('/',(req, res, next) => {
  prisma.User.findMany({
    where:{
      mail:req.body.mail,
      pass: req.body.password
    }
  }).then(usr=>{
    if(usr !=null && usr[0] != null) {
      req.session.login = usr[0];
      req.session.username = usr[0].name;
      let back = req.session.back;
      if(back == null){
        back = '/';
      }
      res.redirect(back);
    } else {
      const data = {
        content: '名前かパスワードに問題があります。再度入力してください。'
      }
      res.render('index', data)
    }
  })
})