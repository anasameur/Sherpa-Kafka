const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('../.config.json');

// Get all util function
const { logger } = require('../utils');


// Get kafka utils
const kafka = require('../kafka')

// set server params.
const { hostname } = config.server;
const port = process.env.PORT || config.server.port;

/* ************************** */
/*       Express Config       */
/* ************************** */

// creat Express object.
const app = express();
app.set('trust proxy', true);

// use body parser to parse body param
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
    if (err) {
        // Catch bodyParser error
        logger.info(`Invalid Request data ${err}`);
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    id: 'Invalid Request',
                    message: `Invalid Request data ${err.message}`,
                },
            })
        );
    } else {
        next();
    }
});

// allow cors
app.use(cors());

// Set route object
const myRouter = express.Router();

// set route variable to be used by app
app.use(myRouter);

// start server
app.listen(port, () => {
    // eslint-disable-next-line
    logger.info(`Server ${hostname} start on port: ${port}`);
});

/* ********************************** */
/*   Send message to Kafka topic API  */
/* ********************************** */

myRouter.route('/api/v1/placerequest').post(async (req, res) => {
    try {
        var data = await kafka.placerequest('msg');
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify(data)
        );
    } catch (error) {
        logger.info(`Sending message to kafka topic error ${error}`);
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    message: error,
                },
            })
        );
    }

});


