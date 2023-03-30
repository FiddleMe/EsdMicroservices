const express = require("express");
const env = require('dotenv').config();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 4002;

const amqp = require("amqplib");
var channel, connection;
var recipient, status_msg;
connectQueue() // call connectQueue function
async function connectQueue() {
    try {

        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel()
        // connect to 'update-status', create one if doesnot exist already
        await channel.assertQueue("update-status")

        channel.consume("update-status", data => {
            recipient = JSON.parse(data.content)["recipient"];
            status_msg = JSON.parse(data.content)["status_msg"];
            sendEmail(recipient, status_msg);
            channel.ack(data);
            
        })
    } catch (error) {
        console.log(error)
    }
}

app.listen(PORT, () => console.log("Server running at port " + PORT));

function sendEmail(recipient, status_msg){
    console.log(recipient, status_msg)
    //generate subject/message based on status message
    var subject = "Order Feedback Payment Received Error"
    var message = "Thank you for your feedback/payment, ...." + status_msg

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
          // user: 'testrestaurantmanager@gmail.com', // your email
          // pass: 'hhfi(*^86983Gg4g\]g3\gd', // your email password
          // clientId: `974922486999-4ispvj41sl5ch09vm5aml0qktscvaeqo.apps.googleusercontent.com`,
          // clientSecret: `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`,
          // refreshtoken: `1//04axdblnnFaKtCgYIARAAGAQSNwF-L9IrN9cv6YjrQ2veVs8JinKRDlnB3kPoNAmpwWUwV5UUGmRszY4j7wAoyx0plNqJbC4q7z8`
        }
      });
    
      const mailOptions = {
        from: process.env.MAIL_USERNAME, // your email
        to: recipient,
        subject: subject,
        text: message
      };
     
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent');
        }
      });
}
