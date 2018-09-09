const express = require('express');
const helmet = require('helmet');
const knex = require('knex')

const dbConfig = require('./knexfile')
const db = knex(dbConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());



server
  .route('/')
  .get((req, res) => {
    res.status(200).json({ api: 'running' });
});

server
  .route('/api/zoo')
  .post((req, res) => {
    const name = req.body;
    console.log(name)
    db.insert(name)
      .into('zoos')
      .then(ids => {
        res.status(201).json(ids)
    })
      .catch(err => {
        res.status(401).json({error: err})
      })

  })
  .get((req, res) => {
    db('zoos')
      // select picks the field to bring
      .select('name', 'id')
      .then(name => {
        res.status(200).json(name);
      })
      .catch(err => res.status(500).json(err));
  });
server
  .route('/api/zoo/:id')
  .get((req, res) => {
    const id = req.params;
    console.log(id)
    db('zoos')
      .select('name')
      .where(id)
      .then(name => {
        res.status(200).json(name)
      })
      .catch(err => res.status(500).json(err))
  })
  .delete((req, res) => {
    const {id} = req.params;
    db('zoos')
      .where('id', id)
      .del()
      .then(name => {
        res.status(200).json(name)
      })
      .catch(err => res.status(500).json(err))      
  })
  .put((req, res) => {
    const {id} = req.params;
    const body = req.body;
    db('zoos')
      .where('id', id)
      .update(body)
      .then(name => {
        res.status(200).json(name)
      })
      .catch(err => res.status(500).json(err))
  })


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
