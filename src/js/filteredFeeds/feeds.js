const { BlockchainMode, Client } = require('dsteem')
const axios = require('axios')
const { db, sql } = require('./database/postgres');
const { IsValidJSONString } = require('../helpers/json')

global.rpc_node = 'https://api.steemit.com'

//connect to server which is connected to the network/testnet
let client = new Client(rpc_node)

let botlists;
let query = {
  tag: '',
  limit: 8
}

let botAuthor = [
  'minnowbooster',
  'smartsteem'
]

async function getBots() {
  let z = await axios.get('https://steembottracker.net/bid_bots').catch(console.error)
  let data = z.data
  botlists = data.map(bot => {
    return bot.name
  })

}

getBots()

let compiledFeeds = db.define('compiledFeeds', {
  trend_all: {
    type: sql.JSON,
    allowNull: false
  },
  hot_all: {
    type: sql.JSON,
    allowNull: false
  },
  trend_travel: {
    type: sql.JSON,
    allowNull: false
  },
  trend_crypto: {
    type: sql.JSON,
    allowNull: false
  },
  trend_health: {
    type: sql.JSON,
    allowNull: false
  },
  trend_photo: {
    type: sql.JSON,
    allowNull: false
  },
  trend_science: {
    type: sql.JSON,
    allowNull: false
  },
  trend_podcasts: {
    type: sql.JSON,
    allowNull: true
  },

  // Timestamps
  createdAt: sql.DATE
})

"use strict";

/* @params query.limit = 5 is to reset the api limit
 * after each api call, cause every api call sets its own query.limit
 * @params botVoted includes false 
 * @params Added console.time to time the operation
 * Notes : query.limit must be almost the same as feeds.length to minimize time for data process
 *         Added filters for bot owner written post but not used bidbots
 */

async function getDiscussions(mode, tag, feeds = []) {
  console.time('procFeeds');
  const _query = { ...query };
  _query.tag = tag || "";
  const posts = await client.database.getDiscussions(mode, _query).catch(console.error);
  for (const post of posts) {
    let botVoted = false;

    if (botAuthor.includes(post.author)) continue;

    for (const { voter } of post.active_votes) {

      if (botVoted = botlists.includes(voter)) break;
    }

    if (!botVoted) {

      if (IsValidJSONString(json_metadata)) {
        let json = JSON.parse(json_metadata);
        if (json.hasOwnProperty('profile')) {
          newPost = Object.assign({ profile: json.profile }, post)
        }
      } else {
        newPost = post;
      }

      }

    }
  }

  /* If data length matched minimum, export it*/
  if (feeds.length >= 6) {
    query.limit = 10;
    return feeds
  }

  /*this is for the case feeds array have less than min data = 4 and already queried more than 50 as limit
   * we returned them as null*/
  if (feeds.length >= 0 && feeds.length <= 6 && query.limit >= 50) {
    query.limit = 10
    return feeds;
  }

  else {
    /*If query limit is still less than 90, we can safely increment the limit
     */
    query.limit <= 90 ? query.limit += 10 : query.limit;
    feeds.length = 0;
    return await getDiscussions(mode, tag, feeds);
  }

}

//Arrays of all categories of post, filtered post are stored here
const trend_all = [], hot_all = [], trend_travel = [], trend_crypto = [], trend_health = [], trend_photo = [], trend_podcasts = [],
  trend_science = [];

const postArguments = [
  [trend_photo, "hot", "photography"],
  [trend_podcasts, "trending", "podcasts"],
  [trend_travel, "trending", "travel"],
  [trend_science, "trending", "science"]

];
const postArguments2 = [
  [trend_all, "trending"],
  [hot_all, "hot"],
  [trend_health, "trending", "health"],
  [trend_crypto, "hot", "cryptocurrency"],
]

async function processPosts([target, mode, tag]) {
  const posts = await getDiscussions(mode, tag);
  target.push(posts);
  console.log('--------->' + ` Added ${mode}, ${tag}`)
  console.timeEnd('procFeeds')
  return posts;
}

//Process by batch instead one by one to not trigger network timeout
async function execFeeds() {
  try {
    await Promise.all(postArguments.map(processPosts));
    await Promise.all(postArguments2.map(processPosts))
  } catch (e) {
    console.error(e);
  }
};

execFeeds()
setTimeout(function run() {
  execFeeds()
    .then(() => sav2DB())
    .then(() => {
      setTimeout(run, 10 * 60 * 1000);
    })
}, 10 * 60 * 1000);

//Save 2 postgres database
function sav2DB() {
  db.sync()
    .then(() => {

      compiledFeeds.upsert(
        {
          id: 1,
          trend_all: trend_all,
          hot_all: hot_all,
          trend_travel: trend_travel,
          trend_crypto: trend_crypto,
          trend_health: trend_health,
          trend_photo: trend_photo,
          trend_science: trend_science,
          trend_podcasts: trend_podcasts
        })

    })
    .catch(e => {
      console.error(e)
    })
}

//route to retrieve latest feeds from postgres
function getFeedsDB() {
  return compiledFeeds.findAll({
    raw: true
  })
    .then(res => {
      return res[0]
    })
}


module.exports = {
  db,
  sql,
  getDiscussions: getDiscussions,
  getFeedsDB: getFeedsDB
}
