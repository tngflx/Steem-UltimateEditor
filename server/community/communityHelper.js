const { groupsController, gControl, sql } = require('../../../../steemult-db/postgres')
const { client } = require('../../vendors/dsteem')

module.exports = {
/*
To separate members of community according to roles given
thereby providing different permission
*/
getAllMembersbyRole: (community) => {
    return gControl.Role.findAll().then(roles => {
      return roles.map(role => role.get('name'))
    }).then(async roleLists => {
      return await Promise.all(roleLists.map(roleList => {
        return groupsController().findAll({
          where: {
            community
          },
          attributes: ['community', 'membersNum'],
          include: [{
            all: true,
            attributes: ['username'],
            include: [{
              model: gControl.Role,
              as: 'role',
              where: {
                name: roleList
              },
              attributes: ['name']
            }]
          }],
          raw: true
        })
      }))

    }).then((members) => {
      return members.reduce((accum, curVal, idx) => {
        let role,membersNum
        let int = curVal.map(t => {
          role = t["members.role.name"]
          membersNum = t["membersNum"]
          return t["members.username"]
        })
        accum[role] = int
        accum['totalNum'] = membersNum;
        return accum
      }, {})
    })
  },

/*
get groups joined / favourited by the member
*/
  getJoinedGroupsbyMember: (who) => {
    return groupsController().findAll({
      attributes: ['community'],
      include: [{
        model: gControl.Members,
        as: 'members',
        where: {
          username: who
        }
      }]
    }).then(groups => {
      return groups.map(group => group.community);
    })
  },
