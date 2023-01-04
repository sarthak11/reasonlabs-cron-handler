'use strict';

const https = require('https');
const request = require('request');
const rp = require('request-promise');

function callURLApi(callback) {
    let response = '';
    
    https.get('https://cfrkftig71.execute-api.us-east-1.amazonaws.com/prod?expert=true', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try {
                response = JSON.parse(data);
            } catch (e) {
                return callback([]);
            }
            return callback(response);
        });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    
}

async function iterateUrlsToSend(validUrls) {
    for (var i=0; i<validUrls.length; i++) {
            await downloadAndSendData(validUrls[i], function() {
        })
    }
}


async function downloadAndSendData(url) {
    let name = url.split('/').pop();
    var options = {
        method: 'GET',
        url: url,
        encoding: 'binary',
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    };
    rp(options)
        .then(async function(binaryData) {
            let obj = {
                name: name,
                url: url,
                binaryData: binaryData
            }
            await transferAndSaveFile(obj);
    });
}

async function transferAndSaveFile(obj) {
    const formData = {
        name: obj.name,
        url: obj.url,
        file: obj.binaryData
    }
    request.post({ url: 'http://localhost:3001/file/save', formData: formData}, function (err, httpResponse, body) {
        console.log(body);
    })
}


module.exports = {
    callURLApi,
    iterateUrlsToSend
}
