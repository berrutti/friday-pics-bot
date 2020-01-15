require('dotenv').config();
const files = require('./utils/files');
const git = require('./utils/git');

git.pullOrClone()
  .then(files.createNewPostsFile)
  .then(filename => {
    git.pushNewFile(filename)
  })
  .catch(error => {
    console.error(error);
  });
