const router = require('express').Router();
const fs = require('fs');
const esservice = require('../es-service');

// expect json files
router.get('/', (req, res) => {
    fs.readdir('../data', (err, files) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
        res.send(files);
    });
});



module.exports = router;