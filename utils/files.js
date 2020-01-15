const fs = require('fs').promises;
const reddit = require('./reddit');

exports.getTodayString = function() {
  return new Date().toISOString().split('T')[0]
}

function getMostUpvotedPost(posts) {
  return posts.reduce((previous, current) => (previous.upvotes > current.upvotes) ? previous : current, 0);
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getPageHeader(imageUrl) {
  const todayString = exports.getTodayString();

  return `---\n` +
    `title: "Picdump for ${new Date().toDateString()}"\n` +
    `date: ${todayString}\n` +
    `image: ${imageUrl}\n` +
    `---\n\n`;
}

function buildPage(posts) {
  const imageUrl = getMostUpvotedPost(posts).url;
  const pageHeader = getPageHeader(imageUrl);

  let pageBody = '';
  const shuffledPosts = shuffleArray(posts);

  shuffledPosts.forEach(post => {
    pageBody = pageBody +
      `## ${post.title}\n` +
      `<a href="https://www.reddit.com${post.permalink}">\n` +
      `<img src="${post.url}" alt="OP: ${post.op}" title="OP: ${post.op}" />\n` +
      `</a>\n\n`;
  });

  return pageHeader + pageBody;
};

function writeFile(page) {
  const path = `${process.env.POSTS_DIRECTORY}/${exports.getTodayString()}.md`;
  return new Promise((resolve, reject) => {
    fs.writeFile(path, page)
      .then(() => {
        resolve(path);
      })
      .catch(() => {
        reject('Could not write file');
      });
  });
}

exports.createNewPostsFile = function () {
  return reddit
    .getTopPostsArray()
    .then(array => {
      const page = buildPage(array)
      return writeFile(page);
    });
}