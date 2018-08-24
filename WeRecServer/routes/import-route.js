const router = require('express').Router();
const mongoose = require('../set-mongoose');
const User = require('../models_praha/MemberInfo');
const Deal = require('../models_praha/DealInfo');
const MemberAction = require('../models_praha/MemberActionInfo');
const History = require('../models/History');

router.get('/user/:number', (req, res) =>
    User.find({}, '', { limit: req.params.number })
        .then(users => res.send(users))
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        }));

router.post('/hist', (req, res) => {
    let date = new Date(req.body.date);
    // This is the way praha saves dates
    date = date.getFullYear.toString() + (date.getMonth() + 1).toString()
        + date.getDate().toString();
    MemberAction.find({ day: date }, { limit: req.body.numUser })
        .then(data => {
            let historyGroup = [];
            data.forEach(elem => {
                const didlist = elem.c.map(deal => deal.did);
                let tempHistory = {
                    userId: elem.mid,
                    history: didlist
                };
                historyGroup.push(tempHistory);
            });
            let result = new History({

            });
            return History.create(historyGroup).then(
                () => res.send('Import success with' + LIMIT + ' member histories'));
        }).catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});