
var grant = require('grant').vercel({
  config: require('./config.json'), session: {secret: 'grant'}
})

module.exports = async (req, res) => {
  await grant(req, res)
}
