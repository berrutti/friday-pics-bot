require('dotenv').config();
const files = require('./utils/files');
const git = require('./utils/git');

git
  .pullOrClone()
  .then(files.createNewPostsFile)
  .then(file => {
    return git.pushNewFile(file)
  })
  .then(result => console.log(result))
  .catch(error => {
    console.error(error);
  });
