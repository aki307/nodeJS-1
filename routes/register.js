const express = require('express');
const router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

const { check, validationResult } = require('express-validator');

router.get('/', (req, res, next) => {
    var data = {
        content: '',
        form: {name:'', mail:'', password:''}
    }
    res.render('register', data);
});

router.post('/', [
    check('name', 'Name は必ず入力してください。').notEmpty(),
    check('email', 'E-Mail Address はメールアドレスを入力してください。').isEmail(),
    check('password', 'Passwordは7文字以上で入力してください').isLength({ min:7 }),
    check('confirm-password', 'パスワードを一致させてください').custom((value, { req } )=>{
        return value === req.body.password
    }),
    check('email').custom(async (value) => {
        const existingUser = await prisma.user.findUnique({
            where: {
                mail: value,
            },
        });
        if (existingUser) {
            throw new Error('このメールアドレスは既に登録されています。');
        }
        return true;
    }),
    
], (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        let result = '<ul class = "text-danger">';
        let result_arr =  errors.array();
        for(let n in result_arr){
            result += '<li>' + result_arr[n].msg + '</li>'
        }
        result += '</ul>';
        const data = {
            content: result,
            form: req.body
        }
        res.render('register', data);
    } else {
        
        prisma.User.create({
            data:{
                name: req.body.name,
                mail: req.body.email,
                pass: req.body.password
            }
        }).then(()=> {
            res.redirect('/');
        });
    }

    
})

module.exports = router;