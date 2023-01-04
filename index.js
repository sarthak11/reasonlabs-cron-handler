'use strict';

const express = require("express");
const app = express();
const cron = require("node-cron");
const propertiesReader = require('properties-reader');
const properties = propertiesReader(__dirname  + '/config/properties.ini');

let apiConnector = require('../reasonlabs-cron-handler/connector/apiconnector');
let responseProcessor = require('../reasonlabs-cron-handler/processor/responseprocessor');

var cronExpression = properties.get('cron.expression');

cron.schedule(cronExpression, async function () {
   console.log("---------------------");
   console.log("running a task every 5 minutes");
   apiConnector.callURLApi(async function(apiResponse) {
      let validUrls = responseProcessor.extractUrls(apiResponse, []);
      await apiConnector.iterateUrlsToSend(validUrls)
   });
 });