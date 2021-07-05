'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const queryString = require('querystring');

const app = express();

const buzzwords = [];
let score = 0;

app.use(bodyParser.urlencoded());

app.use(express.static('public'));

app.get('/buzzwords', (req, res) => {
  res.json({ buzzWords: buzzwords });
});

app.post('/buzzwords', (req, res) => {
  if (
    typeof req.body.buzzWord !== 'string' ||
    isNaN(parseInt(req.body.points))
  ) {
    return res.json({ success: false });
  }

  if (buzzwords.length > 4) {
    buzzwords.shift();
  }

  const newWord = {
    buzzWord: req.body.buzzWord,
    points: parsteInt(req.body.points)
  };

  buzzwords.push(newWord);

  res.json({ success: true });
});

app.put('/buzzwords', (req, res) => {
  const index = buzzwords.findIndex(x => x.buzzWord === req.body.buzzWord);

  if (index === -1) {
    return res.json({ success: false });
  }

  buzzwords[index].points = req.body.points;
  res.json({ success: true });
});

app.delete('/buzzwords', (req, res) => {
  const index = buzzwords.findIndex(x => x.buzzWord === req.body.buzzWord);

  if (index === -1) {
    return res.json({ success: false });
  }

  buzzwords.splice(index, 1);
  res.json({ success: true });
});

app.post('/reset', (req, res) => {
  if (!req.body.reset) {
    return res.json({ success: false });
  }

  buzzwords.length = 0;
  score = 0;

  res.json({ success: true });
});

app.post('/heard', (req, res) => {
  const index = buzzwords.findIndex(x => x.buzzWord === req.body.buzzWord);

  if (index === -1) {
    return res.json({ success: false });
  }

  score += buzzwords[index].points;

  res.json({ totalScore: score });
});

app.listen(8080, () => {
  console.log('the server is up');
});
