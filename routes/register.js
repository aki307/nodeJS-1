const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    var data = {
        title: 'Hello',
        content: 'ここは登録ページです'
    }
    res.render('register', data);
});

router.post('/post', (req, res, next) => {
    res.redirect('/');
})

module.exports = router;