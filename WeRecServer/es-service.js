const elastic = require('elasticsearch');

const client = new elastic.Client({
    host: '10.102.50.47:9200',
    log: 'trace'
});

pack = {};

pack.getOne = id =>
    client.search({
        index: 'ojm5',
        filterPath: ['hits.hits._source'],
        body: {
            'query': {
                'ids': {
                    'values': [id]
                }
            }
        }
    });

pack.getMany = ids =>
    client.search({
        from: 0,
        size:ids.length,
        index: 'ojm5',
        filterPath: ['hits.hits._source'],
        body: {
            'query': {
                'ids': {
                    'values': ids
                }
            }
        }
    });

module.exports = pack;