const express = require('express');
const router = express.Router();
const asyncMiddleWare = require("./asyncMiddleware");
const RepositoryDAO = require("../db/dao/repo.dao");

router.get('/', function (req, res, next) {
  res.status(200).json({
    title: 'Successfully connected!'
  });
});

router.get("/repos", asyncMiddleWare(async(req, res, next) => {
  const repos = await RepositoryDAO.getRepositories();
  res.status(200).json({
    repos
  });
}));

router.get("/repos/:owner/:name", asyncMiddleWare(async(req, res, next) => {
  console.log(req.params.owner);
  const repo = await RepositoryDAO.getRepository(`${req.params.name}:${req.params.owner}`);
  res.status(200).json({
    repo
  });
}));

module.exports = router;