const router = require('express').Router();
const parse = require('csv-parse');
const fs = require('fs');
const grpc = require('grpc');
const esservice = require('../es-service');
const csvparse = require('csv-parse');

const PROTO_PATH = __dirname + '/../../../item_embed_rec/wprecservice.proto';

const wprec_proto = grpc.load(PROTO_PATH).wprecservice;

const client = new wprec_proto.WpRecService('localhost:50051',
    grpc.credentials.createInsecure());

// send list of result csv files
router.get('/', (req, res) => {
    fs.readdir('../results', (err, files) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
        res.send(files);
    });
});

router.get('/single/:id', (req, res) => {
    esservice.getOne(req.params.id).then(body => {
        const response = body.hits.hits[0]._source;
        res.send({
            id: req.params.id,
            name: response._2,
            url: resposnse._3
        });
    }, err => {
        console.error(err);
        res.sendStatus(500);
    });
});

router.get('/:name', (req, res) => {
    fs.stat('../results/' + req.params.name, (err, stat) => {
        if (err) {
            if (err.code == 'ENOENT')
                res.sendStatus(404);
            else {
                console.error(err);
                res.sendStatus(500);
            }
        }
        else {
            // currently, only support csv file
            let splitted = req.params.name.split('.');
            if (slitted[splitted.length - 1] != 'csv') {
                res.sendStatus(401);
                return;
            }
            // parse csv and make object list(through elasticsearch)
            fs.createReadStream('../results/' + req.params.name).pipe(
                parse({
                    delimiter: ',',
                    columns: ['dealid', 'score']
                }, (err, data) => {
                    if (err) {
                        console.error(err);
                        res.sendStatus(500);
                    }
                    else {
                        const ids = data.map(elem => elem.dealid);
                        esservice.getMany(ids).then(body => {
                            const responses = body.hits.hits;
                            responses.forEach(elem => {
                                const id = elem._source['_1'];
                                let index = data.findIndex(value => value.dealid == id);
                                data[index].name = elem._source['_2'];
                                data[index].url = elem._source['3'];
                            });
                            res.send(data);
                        }, err => {
                            console.error(err);
                            res.sendStatus(500);
                        })
                    }
                }))
        }
    })
});

router.post('/user_profile', (req, res) => {
    if (!req.body.dayFrom || !req.body.dayTo) {
        res.sendStatus(401);
        return;
    }
    const fromDate = new Date(req.body.dayFrom);
    const toDate = new Date(req.body.dayTo);
    fromMonth = fromDate.getMonth() + 1;
    if (fromMonth < 10) fromMonth = '0' + fromMonth;
    fromDay = fromDate.getDate();
    if (fromDay < 10) fromDay = '0' + fromDay;
    toMonth = toDate.getMonth() + 1;
    if (toMonth < 10) toMonth = '0' + toMonth;
    toDay = toDate.getDate();
    if (toDay < 10) toDay = '0' + toDay;
    const profile_file = '../../item_embed_rec/profile_' + fromMonth + '-' + fromDay + '_' + toMonth + '-' + toDay + '.csv';
    const filestream = fs.createReadStream(profile_file);
    const parser = csvparse();
    let userIds = [];
    parser.on('readable', () => {
        while (record = parser.read()) {
            userIds.push(record[0]);
        }
        res.send(userIds);
        parser.end();
    });
    parser.on('error', err => {
        console.error(err);
        res.sendStatus(500);
        parser.end();
    });
    filestream.pipe(parser);
});

router.post('/predict', (req, res) => {
    if (!req.body.methodName || !req.body.dayFrom || !req.body.dayTo || !req.body.predictMoment || !req.body.user) {
        res.sendStatus(401);
        return;
    }
    const fromDate = new Date(req.body.dayFrom);
    const toDate = new Date(req.body.dayTo);
    fromMonth = fromDate.getMonth() + 1;
    if (fromMonth < 10) fromMonth = '0' + fromMonth;
    fromDay = fromDate.getDate();
    if (fromDay < 10) fromDay = '0' + fromDay;
    toMonth = toDate.getMonth() + 1;
    if (toMonth < 10) toMonth = '0' + toMonth;
    toDay = toDate.getDate();
    if (toDay < 10) toDay = '0' + toDay;
    req.body.dayFrom = fromMonth + '-' + fromDay;
    req.body.dayTo = toMonth + '-' + toDay;

    const pmDate = new Date(req.body.predictMoment);
    let pmMonth = pmDate.getMonth() + 1;
    if (pmMonth < 10) pmMonth = '0' + pmMonth;
    let pmDay = pmDate.getDate();
    if (pmDay < 10) pmDay = '0' + pmDay;
    let pmHour = pmDate.getHours();
    if (pmHour < 10) pmHour = '0' + pmHour;
    req.body.predictMoment = pmDate.getFullYear() + '-' + pmMonth + '-' + pmDay + ' ' + pmHour;

    client.getRecommend(req.body, (err, result) => {
        if (err || result.error > -1) {
            if (err)
                console.error(err);
            res.sendStatus(500);
        }
        res.send(result.result);
    });
});

module.exports = router;