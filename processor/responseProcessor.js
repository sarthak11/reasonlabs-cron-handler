'use strict';

function extractUrls(response, validUrls) {
    for(var prop in response) {
        if(typeof response[prop] == 'object'){
            extractUrls(response[prop], validUrls);
        } else{
            validUrls.push(response[prop]);
        }
    }
    return validUrls;
}

module.exports = {
    extractUrls
}