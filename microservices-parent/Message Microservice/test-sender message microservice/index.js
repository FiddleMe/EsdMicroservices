const express = require("express");
const amqp = require("amqplib");
const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

var channel, connection;
//recipient, subject, message
var recipient = "iamsomoene@gmail.com"; //should be customer email from complex microservice -- enter your email here to test
var status_msg = "Payment Successful"; //should be status from complex microservice

connectQueue() // call connectQueue function
async function connectQueue() {
    try {

        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel()
        
        // connect to 'update-status' queue, create one if doesnot exist already
        await channel.assertQueue("update-status")
        
    } catch (error) {
        console.log(error)
    }
}

const sendData = async (data) => {
    // send data to queue
    await channel.sendToQueue("update-status", Buffer.from(JSON.stringify(data)));
        
    // close the channel and connection
    await channel.close();
    await connection.close();
}

app.get("/send-msg", (req, res) => {
    const data = {
        recipient: recipient,
        status_msg: status_msg
    }

    sendData(data);

    console.log("A message is sent to queue")
    res.send("Message Sent");
    
})


app.listen(PORT, () => console.log("Server running at port " + PORT));