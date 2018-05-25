const router = require('express').Router();
const parse = require('csv-parse');
const fs = require('fs');
const esservice=require('../es-service');

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

router.get('/single/:name', (req, res) => {
    
})

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

module.exports = router;