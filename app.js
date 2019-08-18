/* https://api-ip.fssprus.ru/home
Ваш ключ доступа к API: ppLvYvSByqkk 
Дата окончания действия ключа доступа: 08.08.2020*/

const express = require('express');
const app = express();
const request = require('request');
app.set('view engine', 'ejs');

let searchId;

app.get('/', function(req, res){
    res.render('home');
});

app.get('/results', function(req, res){
    const region = req.query.region;
    const lastname = req.query.lastname;
    const firstname = req.query.firstname;
    const birthdate = req.query.birthdate;
    request(encodeURI(`https://api-ip.fssprus.ru/api/v1.0/search/physical/?region=${region}&lastname=${lastname}&firstname=${firstname}&birthdate=${birthdate}&token=ppLvYvSByqkk`), function(error, response, body){
       if(!error && response.statusCode === 200){
            const data = JSON.parse(body);
            searchId = data.response.task;
            res.render('results', {searchId: searchId});
        }
    });
});



app.listen(3000, () => console.log('Debt App has started!'));