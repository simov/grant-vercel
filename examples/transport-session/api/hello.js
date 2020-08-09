
var Session = require('grant/lib/session')({
  secret: 'grant', store: require('../store')
})

module.exports = async (req, res) => {
  var session = Session(req)

  var {response} = (await session.get()).grant
  await session.remove()

  res.statusCode = 200
  res.setHeader('content-type', 'text/plain')
  res.end(JSON.stringify(response, null, 2))
}
