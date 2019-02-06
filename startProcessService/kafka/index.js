var kafka = require('kafka-node')
var Producer = kafka.Producer
var client = new kafka.KafkaClient({ kafkaHost: '10.1.0.145:9092,10.1.0.145:9092,10.1.0.145:9092' })

// Get all util function
const { logger } = require('../utils');

// Get all KafkaClient event for log
client.on('zkReconnect', function () {
    logger.info(`Successfull reconnection to zookeeper`);
});
client.on('reconnect', function () {
    logger.info(`Successfull reconnection to kafka cluster`);
});
client.on('connect', function () {
    logger.info(`Successfull connection to kafka cluster`);
});
client.on('close', function () {
    logger.info(`connection with kafka cluster closed`);
});
client.on('brokersChanged', function () {
    logger.info(`kafka cluster brokersChanged`);
});
client.on('error', function (err) {
    logger.error(`Error event kafkaclient ${err}`);
});
client.on('socket_error', function (err) {
    logger.error(`Error event socket_error ${err}`);
})


// Creat kafka producer 
var producer = new Producer(client)


producer.on('ready', function () {
    logger.info(`Kafka producer ready`);
});
producer.on('error', function (error) {
    logger.error(`kafka producer error: ${error}`);
})

/**************************************/
/*              Place request         */
/**************************************/

function placerequest(msg) {
    return new Promise((resolve, reject) => {
        var payloads = [
            { topic: 'requestPlaced', messages: msg },
        ];
        producer.send(payloads, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data)
        });
    })
}

module.exports = {
    placerequest: placerequest
};



