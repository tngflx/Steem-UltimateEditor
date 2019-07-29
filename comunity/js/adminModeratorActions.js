const { groupsController, gControl, sql, db } = require('../../../../../steemult-db/postgres')
const { updateJSON, concatNestedJSON } = require('../helpers/jsonbMethods')

/** Actions allowed by moderators **/
class moderatorActions {
  markAnnouncement(community, author, permlink) {
    return groupsController().findOne({
      where: {
        community
      },
      include: [{
        model: gControl.Members,
        as: 'members',
        include: [{
          model: gControl.Posts,
          where: {
            author,
            permlink
          },
          as: 'posts'
        }],
      }]
    }).then(({ members }) => {
      let post = members[0].posts[0]
      post.update({
        status: 'announce'
      })
    })
  }

  delete(community, author, permlink) {
    return groupsController().findOne({
      where: {
        community
      },
      include: [{
        model: gControl.Members,
        as: 'members',
        include: [{
          model: gControl.Posts,
          where: {
            author,
            permlink
          },
          as: 'posts'
        }],
      }]
    }).then(({ members }) => {
      let post = members[0].posts[0]
      post.destroy()
    })
  }

  muteUser() {
    return groupsController().findOne({
      where: {
        community
      },
      include: [{
        model: gControl.Members,
        as: 'members',
        include: [{
          model: gControl.Posts,
          where: {
            author,
            permlink
          },
          as: 'posts'
        }],
      }]
    }).then(({ members }) => {
      members[0].update({
        muted: 1
      })
    })
  }
}

/** Actions allowed by admins
* @permission hard delete, revert post delete, mute user
**/
class adminActions {

  confirmDel(community, author, permlink) {
    return groupsController().findOne({
      where: {
        community
      },
      include: [{
        model: gControl.Members,
        as: 'members',
        include: [{
          model: gControl.Posts,
          where: {
            author,
            permlink
          },
          as: 'posts'
        }],
      }]
    }).then(({ members }) => {
      let post = members[0].posts[0]
      post.destroy()
    })
  }

  revertDel(community, author, permlink) {
    return groupsController().findOne({
      where: {
        community
      },
      include: [{
        model: gControl.Members,
        as: 'members',
        include: [{
          model: gControl.Posts,
          where: {
            author,
            permlink
          },
          as: 'posts'
        }],
      }]
    }).then(({ members }) => {
      let post = members[0].posts[0]
      post.update({
        status: 'approved'
      })
    })
  }
}

module.exports= {
  adminActions: new adminActions(),
  moderatorActions: new moderatorActions()
}
