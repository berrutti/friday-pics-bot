const Snoowrap = require('snoowrap');

const r = new Snoowrap({
  userAgent: 'user-agent',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
});

const options = {
  time: 'week',
  limit: 8
}

function isImagePost(url) {
  return url.endsWith('jpg') || url.endsWith('png') || url.endsWith('gif');
}

function isAlreadyPosted(url) {
  return false;
}

function getImagePosts(topPostsArray) {
  const posts = [];
  topPostsArray.forEach(topPosts => {
    topPosts.forEach(post => {
      if (isImagePost(post.url)) {
        posts.push({
          title: post.title,
          url: post.url,
          op: post.author.name,
          permalink: post.permalink,
          upvotes: post.upvotes
        })
      }
    })
  })
  return posts;
}

exports.getTopPostsArray = function() {
  const topRedditPosts = [
    r.getTop('CrappyDesign', options),
    r.getTop('nocontextpics', options),
    r.getTop('funny', options),
    r.getTop('funnysigns', options),
    r.getTop('Funnypics', options),
    r.getTop('AdviceAnimals', options),
    r.getTop('pics', options),
    r.getTop('hmmm', options),
    r.getTop('Eyebleach', options),
    r.getTop('memes', options),
  ];

  return Promise.all(topRedditPosts).then(getImagePosts);
}