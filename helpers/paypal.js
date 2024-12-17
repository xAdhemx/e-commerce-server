const paypal = require("paypal-rest-sdk");
require("dotenv").config()

// paypal.configure({
//   mode: "sandbox",
//   client_id: "AWKSqpcoqrEvgDQP1J9ajHKDCnvDtmqUmlfZR6O-P5Uo2X2AtKjfmGs-ZsEXdWZ80BUpWNJ8iZrw9d5k",
//   client_secret: "EAmkwuA9mwQYRiA0fjzeJld4HAPQxI4yIDAxAcI7fd0AtZKafn-RcFUgT6fGEX2l9rKPm2Zl9aGXgwys",
// });

paypal.configure({
  mode: process.env.PAYPAL_MODE,
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

module.exports = paypal;


module.exports = paypal;
