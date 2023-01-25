const amqp = require('amqplib/callback_api');

const opt = { credentials: require('amqplib').credentials.plain('rabbitmq', 'betadvanced159951147741') };

let args = process.argv.slice(2);
if (args.length == 0) {
    console.log("You have to specify the key of the messages you want to receive.");
    process.exit(1);
}

amqp.connect('amqp://localhost', opt, (err, connection) => {
    if (err) throw err;
    connection.createChannel((err1, channel) => {
        if (err1) throw err1;
        let exchange = 'topic_strings';
        channel.assertExchange(exchange, 'topic', { durable: false });

        channel.assertQueue('', { exclusive: true }, (err2, q) => {
            if (err2) throw err2;
        
            console.log("Waiting for messages. To exit press CTRL+C", q.queue);
            args.forEach((key) => {
                channel.bindQueue(q.queue, exchange, key);
            });
            
            channel.consume(q.queue, (msg) => {
                console.log("- Received: %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, { noAck: true });
        });
    });
});