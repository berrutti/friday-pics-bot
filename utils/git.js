const simpleGit = require('simple-git/promise');

function isAlreadyCloned(directory) {
  const fs = require('fs');
  let files = [];
  try {
    files = fs.readdirSync(directory);
  } catch (error) {
    return false;
  }
  return files.length !== 0;
}

function cloneRepo() {
  return simpleGit().clone(process.env.REMOTE, process.env.REPO_DIRECTORY);
}

function pullRepo() {
  return simpleGit(process.env.REPO_DIRECTORY).pull(process.env.REMOTE);
}

exports.pullOrClone = function () {
  if (isAlreadyCloned(process.env.REPO_DIRECTORY)) {
    return pullRepo();
  }
  return cloneRepo();
}

exports.pushNewFile = function (file) {
  return new Promise((resolve, reject) => {
    resolve(file);
  });
}
