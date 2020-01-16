const simpleGit = require('simple-git/promise');
const git = simpleGit(process.env.REPO_DIRECTORY).silent(true);

const files = require('./files');
const fs = require('fs');

function isAlreadyCloned(directory) {
  let files = [];
  try {
    files = fs.readdirSync(directory);
  } catch (error) {
    return false;
  }
  return files.length !== 0;
}

function createFolder() {
  if (!fs.existsSync(process.env.REPO_DIRECTORY)){
    fs.mkdirSync(process.env.REPO_DIRECTORY);
  }
}

exports.pullOrClone = function () {
  if (isAlreadyCloned(process.env.REPO_DIRECTORY)) {
    return git.pull(process.env.REMOTE);
  } else {
    createFolder();
    return simpleGit().clone(process.env.REMOTE, process.env.REPO_DIRECTORY);
  }
  return simpleGit().clone(process.env.REMOTE, process.env.REPO_DIRECTORY);
}

exports.pushNewFile = function (file) {
  console.log(`Pushing file: ${file}`);
  Promise.resolve()
    .then(()=>git.add('./*'))
    .then(()=>git.commit(files.getTodayString()))
    .then(()=>git.push('origin', 'master'));
}
