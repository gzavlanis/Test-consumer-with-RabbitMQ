const amqp = require('amqplib/callback_api');

const opt = { credentials: require('amqplib').credentials.plain('rabbitmq', 'betadvanced159951147741') };

const names = ['George/', 'John/'];

// random string generator starts with 
function randomMessages(length) {
    let randomIndex = Math.floor(Math.random() * names.length);
    let randomName = names[randomIndex];
    let result = randomName + '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

setInterval(() => amqp.connect('amqp://localhost', opt, (err, connection) => {
    if (err) throw err;
    connection.createChannel((err1, channel) => {
        if (err1) throw err1;

        let exchange = 'topic_strings';
        let msg = randomMessages(8);
        end = msg.lastIndexOf("/");
        let key = (msg.length > 0) ? msg.substring(0, end) : 'anonymous'; // if message is empty then anonymous else key is George or John.

        channel.assertExchange(exchange, 'topic', { durable: false });
        channel.publish(exchange, key, Buffer.from(msg));
        console.log("- Sent: %s: '%s'", key, msg);
    });
}), 1000);