const express = require("express");
const env = require('dotenv').config();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const sendMail = require('./gmail');

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
        connection = await amqp.connect("amqp://172.17.0.2:5672/");
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

async function sendEmail(recipient, status_msg){
    console.log(recipient, status_msg)
    const fileAttachments = [
      {
        filename: 'attachment1.txt',
        content: 'This is a plain text file sent as an attachment',
      },
      // {
      //   path: path.join(__dirname, './attachment2.txt'),
      // },
      // {
      //   filename: 'websites.pdf',
      //   path: 'https://www.labnol.org/files/cool-websites.pdf',
      // },
  
      // {
      //   filename: 'image.png',
      //   content: fs.createReadStream(path.join(__dirname, './attach.png')),
      // },
    ];
  
    const options = {
      to: recipient,
      cc: '',
      replyTo: '',
      subject: 'Status: '+ status_msg,
      text: 'Thank you for using our service. Your status is ' + status_msg,
      // html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from <a href="https://digitalinspiration.com">Digital Inspiration</a>.</p>`,
      attachments: fileAttachments,
      textEncoding: 'base64',
    };
  
    const messageId = await sendMail(options);
    return messageId;
}
