
var grant = require('grant').vercel({
  config: require('./config.json'), session: {secret: 'grant'}
})

module.exports = async (req, res) => {
  var {response} = await grant(req, res)
  if (response) {
    res.statusCode = 200
    res.setHeader('content-type', 'text/plain')
    res.end(JSON.stringify(response, null, 2))
  }
}
