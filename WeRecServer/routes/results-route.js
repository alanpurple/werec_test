﻿const router = require('express').Router();
const parse = require('csv-parse');
const fs = require('fs');
const grpc = require('grpc');
const esservice = require('../es-service');
const csvparse = require('csv-parse');
const path = require('path');

const PosData = require('../models/PosData');
const Deal = require('../models/DealW2v');
const Category2 = require('../models/Category2');
const WepickDeal = require('../models/WepickDeal');

const PROTO_PATH = __dirname + '/../../../item_embed_rec/wprecservice.proto';
const wprec_proto = grpc.load(PROTO_PATH).WpRecService;

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

router.get('/category_dict', (req, res) => {
    fs.stat(path.join(__dirname, '../dict/cate_dict.json'), err => {
        if (err) {
            if (err.code === 'ENOENT')
                return res.sendStatus(404);
            else {
                console.error(err);
                return res.sendStatus(500);
            }
        }

        fs.readFile(path.join(__dirname, '../dict/cate_dict.json'), (err, data) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            res.send(JSON.parse(data));
        });
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
                        });
                    }
                }));
        }
    });
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
        let record = parser.read();
        while (record) {
            if (userIds.length < 30)
                userIds.push(record[0]);
            record = parser.read();
        }
    });
    parser.on('error', err => {
        console.error(err);
        res.sendStatus(500);
        parser.end();
    });
    parser.on('end', () => {
        res.send(userIds);
    });
    filestream.pipe(parser);
});

router.get('/user_index/:fromDate/:toDate/:id', (req, res) => {
    if (!req.params.fromDate || !req.params.toDate || !req.params.id)
        return res.sendStatus(401);
    fs.stat('./dict/user_' + req.params.fromDate + '_' + req.params.toDate + '_for_cate.json', err => {
        if (err) {
            if (err.code == 'ENOENT')
                return res.sendStatus(404);
            else {
                console.error(err);
                return res.sendStatus(500);
            }
        }
        fs.readFile('./dict/user_' + req.params.fromDate + '_' + req.params.toDate + '_for_cate.json', (err, data) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            const userId = parseInt(req.params.id);
            const UserDict = JSON.parse(data);
            const userIndex = UserDict.indexOf(userId);
            if (userIndex < 0)
                res.sendStatus(404);
            else
                res.send({ id: userIndex });
        });
    });
});

router.get('/wepick/:time/:slot', (req, res) => {
    WepickDeal.find({
        _id: {
            $gte: req.params.time
                + ' ' + req.params.slot, $lte: req.params.time + ' 99'
        }
    }).populate({
        path: 'deal',
        populate: { path: 'category2' }
    }).then(deals => {
        if (!deals)
            return res.sendStatus(404);
        const result = deals.map(elem => {
            return {
                id: elem.deal._id,
                slot: elem._id.slice(-2),
                date: elem._id.slice(0, elem._id.length - 3),
                title: elem.deal.title,
                category: elem.deal.category2.name,
                categoryId: elem.deal.category2._id
            };
        });
        res.send(result);
    }).catch(err => {
        console.error(err);
        res.sendStatus(500);
    });
});

router.post('/wals-score', (req, res) => {
    if (req.body.userId == undefined || !req.body.items || !req.body.filename1 || !req.body.filename2) {
        res.sendStatus(401);
        return;
    }
    fs.stat('../../' + req.body.filename1 + '.json', err => {
        if (err) {
            if (err.code == 'ENOENT')
                return res.sendStatus(404);
            else {
                console.error(err);
                return res.sendStatus(500);
            }
        }
        fs.stat('../../' + req.body.filename2 + '.json', err => {
            if (err) {
                if (err.code == 'ENOENT')
                    return res.sendStatus(404);
                else {
                    console.error(err);
                    return res.sendStatus(500);
                }
            }
            const userIndex = req.body.userId;

            const userMatrix = JSON.parse(fs.readFileSync('../../' + req.body.filename1 + '.json'));
            const userRow = userMatrix[userIndex];
            const numFeature = userRow.length;
            const itemMatrix = JSON.parse(fs.readFileSync('../../' + req.body.filename2 + '.json'));
            let scores = [];
            req.body.items.forEach(id => {
                let score = 0;
                const itemRow = itemMatrix[id];
                for (let i = 0; i < numFeature; i++)
                    score += userRow[i] * itemRow[i];
                scores.push(score);
            });
            res.send(scores);
        });
    });
});

router.get('/hist/:id/slot/:slot/limit/:limit', (req, res) => {
    PosData.find({ UserId: req.params.id, WepickRank: { $gte: req.params.slot }, TransDate: { $lte: '2018-04-11 20' } })
        .sort({ TransDate: -1 })
        .limit(parseInt(req.params.limit))
        // bad naming, I know
        .populate({
            path: 'DealId',
            populate: { path: 'category2' }
        })
        .then(data => {
            if (!data) {
                return res.sendStatus(404);
            }
            const serviceData = data.map(elem => {
                return {
                    id: elem.DealId._id,
                    slot: elem.WepickRank,
                    date: elem.TransDate,
                    title: elem.DealId.title,
                    category: elem.DealId.category2.name,
                    categoryId: elem.DealId.category2._id
                };
            });
            res.send(serviceData);
        }).catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

router.post('/predict', (req, res) => {
    if (!req.body.methodName || !req.body.fromDate || !req.body.toDate || !req.body.predictMoment || !req.body.user) {
        res.sendStatus(401);
        return;
    }
    const user = parseInt(req.body.user);

    let requestData = {
        methodName: req.body.methodName,
        user: user
    };

    const fromDate = new Date(req.body.fromDate);
    const toDate = new Date(req.body.toDate);
    fromMonth = fromDate.getMonth() + 1;
    if (fromMonth < 10) fromMonth = '0' + fromMonth;
    fromDay = fromDate.getDate();
    if (fromDay < 10) fromDay = '0' + fromDay;
    toMonth = toDate.getMonth() + 1;
    if (toMonth < 10) toMonth = '0' + toMonth;
    toDay = toDate.getDate();
    if (toDay < 10) toDay = '0' + toDay;
    requestData.dayFrom = fromMonth + '-' + fromDay;
    requestData.dayTo = toMonth + '-' + toDay;

    if (req.body.methodName == 'wals') {
        requestData.dimension = req.body.dimension;
        requestData.weight = req.body.weight;
        requestData.coef = req.body.coef;
        requestData.nIter = req.body.nIter;
    }

    const pmDate = new Date(req.body.predictMoment);
    let pmMonth = pmDate.getMonth() + 1;
    if (pmMonth < 10) pmMonth = '0' + pmMonth;
    let pmDay = pmDate.getDate();
    if (pmDay < 10) pmDay = '0' + pmDay;
    //let pmHour = pmDate.getHours();
    let pmHour = 21;
    if (pmHour < 10) pmHour = '0' + pmHour;
    requestData.predictMoment = pmDate.getFullYear() + '-' + pmMonth + '-' + pmDay + ' ' + pmHour;

    if (req.body.methodName == 'wals') {
        delete requestData.methodName;
        client.getMfRecommend(requestData, (err, result) => {
            if (err || result.error > -1) {
                if (err)
                    console.error(err);
                console.error(result.error);
                res.sendStatus(500);
                return;
            }
            let results = result.result;
            let ids = results.map(elem => elem.id);
            Deal.find({ _id: { $in: ids } })
                .populate('category2')
                .then(deals => {
                    if (!deals)
                        return res.sendStatus(404);
                    results.forEach(elem => {
                        let info = deals.find(elem2 => elem2._id == elem.id);
                        if (info != undefined) {
                            elem.title = info.title;
                            elem.category = info.category2.name;
                            elem.categyryId = info.category2._id;
                        }
                    });
                    res.send(results);
                }).catch(err => {
                    console.error(err);
                    res.sendStatus(500);
                });
        });
    }
    else
        client.getRecommend(requestData, (err, result) => {
            if (err || result.error > -1) {
                if (err)
                    console.error(err);
                console.error(result.error);
                res.sendStatus(500);
                return;
            }
            let results = result.result;
            let ids = results.map(elem => elem.id);
            Deal.find({ _id: { $in: ids } })
                .populate('category2')
                .then(deals => {
                    if (!deals)
                        return res.sendStatus(404);
                    results.forEach(elem => {
                        let info = deals.find(elem2 => elem2._id == elem.id);
                        if (info != undefined) {
                            elem.title = info.title;
                            elem.category = info.category2.name;
                            elem.categyryId = info.category2._id;
                        }
                    });
                    res.send(results);
                }).catch(err => {
                    console.error(err);
                    res.sendStatus(500);
                });
        });
});

router.post('/wals-matrix', (req, res) => {
    if (!req.body.fromDate || !req.body.toDate) {
        res.sendStatus(401);
        return;
    }

    let requestData = {
        dimension: req.body.dimension,
        weight: req.body.weight,
        coef: req.body.coef,
        nIter: req.body.nIter
    };

    const fromDate = new Date(req.body.fromDate);
    const toDate = new Date(req.body.toDate);
    fromMonth = fromDate.getMonth() + 1;
    if (fromMonth < 10) fromMonth = '0' + fromMonth;
    fromDay = fromDate.getDate();
    if (fromDay < 10) fromDay = '0' + fromDay;
    toMonth = toDate.getMonth() + 1;
    if (toMonth < 10) toMonth = '0' + toMonth;
    toDay = toDate.getDate();
    if (toDay < 10) toDay = '0' + toDay;
    requestData.dayFrom = fromMonth + '-' + fromDay;
    requestData.dayTo = toMonth + '-' + toDay;

    client.getMfCateRecommend(requestData, (err, result) => {
        if (err || result.error > -1) {
            if (err)
                console.error(err);
            console.error(result.error);
            res.sendStatus(500);
            return;
        }
        delete result.error;
        res.send(result);
    });
});

module.exports = router;