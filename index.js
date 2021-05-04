const bodyParser = require("body-parser");
const request = require('request');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Captcha = require('node-captcha-generator');

const PORT = 8000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/getPaginatedResults', function (req, res) {
    const callApi = options => {
        return new Promise(resolve => {
            request(options, (err, resp, body) => {
                resolve(body)
            })
        })
    }

    const getPaginatedResults = async (pageNo = 1) => {
        let options = {
            method: 'GET',
            url: `https://jsonmock.hackerrank.com/api/stocks/?page=${pageNo}`,
            json: true
        }
        let resp = (await callApi(options)).data
        if (!resp.length) { return resp }
    
        return resp.concat(await getPaginatedResults(pageNo + 1))
    }

    getPaginatedResults().then(data => {
         res.json(data)
    })

})


app.get('/getCaptcha', function (req, res) {
    const generateCaptcha = (length = 5, width = 450, height = 200) => {
        return new Promise(resolve => {
            let params = {
                length, size: {
                    width,
                    height
                }
            }
            let captcha = new Captcha(params);
            captcha.toBase64((err, data) => {
                if (!err) {
                    return resolve({
                        value: captcha.value,
                        data: data
                    })
                }
            })
        })
    }
    generateCaptcha().then(data => {
        res.json(data)
    })
})


server.listen(PORT);
