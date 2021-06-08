require("dotenv").config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const DATA = require("./data");

module.exports = send_sms = (id) => {
  let ph = DATA.cell_numbers.has(id) ? DATA.cell_numbers.get(id) : null
  if (!ph) return undefined
  client.messages
  .create({
     body: '\n Please show up soon to Deepya-ke-Mandure. https://discord.gg/JPzYHDvd',
     from: process.env.TWILIO_PH_NO,
     to: ph
   })
  .then(message => (message.sid)).catch(err => console.log(err))
}