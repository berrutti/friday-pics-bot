function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

function getMostUpvotedPost(posts) {
  return posts.reduce((previous, current) => (previous.upvotes > current.upvotes) ? previous : current, 0);
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getPageHeader(imageUrl) {
  const todayString = getTodayString();

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
  const fileName = `./${getTodayString()}.md`;
  const fs = require('fs').promises;
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, page)
      .then(() => {
        resolve(fileName);
      })
      .catch(() => {
        reject('Could not write file');
      });
  });
}

exports.createNewPostsFile = function () {
  const reddit = require('./reddit');

  return reddit
    .getTopPostsArray()
    .then(array => {
      const page = buildPage(array)
      return writeFile(page);
    });
}