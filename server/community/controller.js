/**
Query to database on trending, new, favourite groups
*/
router.get('/:param/:community?', [sc2.RGuard, sc2.sessViewCounter], async (req, res, next) => {
  const { param, community } = req.params;
  const { type } = req.query;

  switch (param) {
    case 'groups_all':
      switch (type) {
        case 'new':
          groupsController().findAll({
            order: [
              ['membersNum', 'DESC'],
              ['createdAt', 'DESC'],
            ],
            attributes: { exclude: ['membersNum'] }
          }).then(async groups => {
            return await groups.reduce(async (accumulator, { community, dataValues }, idx) => {
              const accum = await accumulator
              let members = await getAllMembersbyRole(community)
              accum[idx] = { ...dataValues, members }
              return accum
            }, [])
          }).then(group =>
            res.status(200).send(group))
            .catch(e => {
              res.status(401).send({ error: e })
            })
          break;

        case 'trending':
          groupsController().findAll({
            //attributes: ['membersNum', 'image', 'hits'],
            order: [
              ['membersNum', 'DESC'],
              ['hits', 'DESC'],
            ],
            attributes: { exclude: ['membersNum'] }
          }).then(async groups => {
            return await groups.reduce(async (accumulator, { community, dataValues }, idx) => {
              const accum = await accumulator
              let members = await getAllMembersbyRole(community)
              accum[idx] = { ...dataValues, members }
              return accum
            }, [])
          }).then(group =>
            res.status(200).send(group))
            .catch(e => {
              res.status(401).send({ error: e })
            })
      }
      break;

/**
Individual group query for additional metadata
**/
    case 'group_profile':
      if (!community) return 'Community field null'
      let communities = community.split(',');
      let processed = await communities.reduce(async (accumulator, curCom) => {
        const accum = await accumulator
        let profiles = await groupsController().findOne({
          where: {
            community: curCom
          },
          include: [{
            all: true,
            attributes: ['username'],
            include: [{
              model: gControl.Role,
              attributes: ['name'],
              as: 'role'
            }]
          }],
          attributes: ['community', 'image', 'faves', 'metadata', 'createdAt', 'membersNum', 'hits'],

        })
          .then(async profile => {
            return {
              metadata: profile.get('metadata'),
              image: profile.get('image'),
              community: profile.get('community'),
              faves: profile.get('faves'),
              hits: profile.get('hits'),
              members: await getAllMembersbyRole(curCom)
            }
          })
          //This catch block got problem, if error occured it will reach res.status once more
          .catch(e => {
            res.status(401).send({ error: e })
          })
        accum[curCom] = profiles;
        //accums.push(profiles)
        return accum;

      }, Promise.resolve({}))

      res.status(200).send(processed);
      break;
