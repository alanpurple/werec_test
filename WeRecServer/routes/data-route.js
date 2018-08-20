const router = require('express').Router();
const fs = require('fs');

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