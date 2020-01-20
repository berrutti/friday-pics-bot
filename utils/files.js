const fs = require('fs').promises;
const reddit = require('./reddit');

exports.getTodayString = function () {
  return new Date().toISOString().split('T')[0]
}

function getTodayLongString() {
  const date = new Date().toDateString();
  return date.substr(date.indexOf(' ') + 1);
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
    `title: "${getTodayLongString()}"\n` +
    `date: ${todayString}\n` +
    `image: ${imageUrl}\n` +
    `---\n\n`;
}

function sanitizeString(string) {
  const cleanArray = string.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
  return cleanArray.trim();
}

function buildPage(posts) {
  const imageUrl = getMostUpvotedPost(posts).url;
  const pageHeader = getPageHeader(imageUrl);

  let pageBody = '';
  const shuffledPosts = shuffleArray(posts);

  shuffledPosts.forEach(post => {
    const title = sanitizeString(post.title);
    pageBody = pageBody +
      `<a href="https://www.reddit.com${post.permalink}">@${post.op}</a>\n` +
      `<img src="${post.url}" alt="${title}" title="${title}" />\n` +
      `\n\n`;
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