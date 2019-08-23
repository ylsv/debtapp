/* https://api-ip.fssprus.ru/home
Ваш ключ доступа к API: ppLvYvSByqkk 
Дата окончания действия ключа доступа: 08.08.2020*/

const express = require('express');
const app = express();
const request = require('request');
app.set('view engine', 'ejs');
app.use(express.static('public'));


let searchId;

app.get('/', function(req, res){
    res.render('home');
});

app.get('/search', function(req, res){
    const region = req.query.region;
    const lastname = req.query.lastname;
    const firstname = req.query.firstname;
    const birthdate = req.query.birthdate;
    const url = encodeURI(`https://api-ip.fssprus.ru/api/v1.0/search/physical/?region=${region}&lastname=${lastname}&firstname=${firstname}&birthdate=${birthdate}&token=ppLvYvSByqkk`);
    request(url, function(error, response, body){
       if(!error && response.statusCode === 200){
            const data = JSON.parse(body);
            searchId = data.response.task;
            res.render('awaitingresults');
        };
    });
});

app.get('/status', function(req, res){
    const url = `https://api-ip.fssprus.ru/api/v1.0/status/?task=${searchId}&token=ppLvYvSByqkk`;
    request(url, function(error, response, body){
        if(!error && response.statusCode ===  200){
            const data = JSON.parse(body);
            if(data.response.status === 0 || data.response.status === 1){
                res.redirect('/results')
            } else if (data.response.status === 2) {
                res.render('awaitingresults')
                console.log('so am i still waiting');
            } else res.send('error occurred, no results rendered');
        };
    });
});

app.get('/results', function(req, res){
    const url = `https://api-ip.fssprus.ru/api/v1.0/result/?task=${searchId}&token=ppLvYvSByqkk`;
    request(url, function(error, response, body){
        if(!error && response.statusCode ===  200){
            const data = JSON.parse(body);
            const foundData = data.response.result[0].result;
            if (foundData.length === 0){
                res.render('noresults');
            } else res.render('results', {foundData: foundData});
        };
    });
});

 
app.listen(3000);