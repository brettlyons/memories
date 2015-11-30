var express = require('express');
var router = express.Router();
var pg = require('pg');
// require('dotenv').load();
var conString = process.env.DATABASE_URL || "postgres://@localhost/memoriesapp";

/* GET users listing. */
router.post('/api/v1/memories', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('INSERT INTO memories(old_days, these_days, year) values($1, $2, $3)',
                 [req.body.data.attributes.old_days, req.body.data.attributes.these_days, req.body.data.attributes.year], function(err, result) {
                   done();

                   res.json({
                     data: {
                       type: "memory",
                       attributes: {
                         "old_days": req.body.data.attributes.old_days,
                         "these_days": req.body.data.attributes.these_days,
                         "year": Number(req.body.data.attributes.year)
                       }
                     }
                   });

                   if (err) {
                     return console.error('error running query', err);
                   }
                 });
  });
});

router.get('/api/v1/memories', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM memories;', function(err, result) {
      done();
      //console.log(result.rows);
      res.json({
        "links": {},
        data: result.rows.map(function (element) {
          return {
            'type': 'memory',
            'id': element.id,
            'attributes': {
              'old_days': element.old_days,
              'these_days': element.these_days,
              'year': element.year
            },
            'links': {}
          };
        })
      });
      if (err) {
        return console.error('error running query', err);
      }
    });
  });
});

router.get('/api/v1/memories/years', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT year FROM memories;', function(err, result) {
      done();
      console.log(result);
      res.json({
        "links": {},
        data: result.rows.map(function(object) {return Number(object.year);})
      });
      if (err) {
        return console.error('error running query', err);
      }
    });
  });
});

router.get('/api/v1/memories/:year', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM memories WHERE year = $1;', [req.params.year], function(err, result) {
      done();
      res.json({
        "links": {},
        data: result.rows.map(function (element) {
          return {
            'type': 'memory',
            'id': element.id,
            'attributes': {
              'old_days': element.old_days,
              'these_days': element.these_days,
              'year': element.year
            },
            'links': {}
          };
        })
      });
      if (err) {
        return console.error('error running query', err);
      }
    });
  });
});

module.exports = router;
