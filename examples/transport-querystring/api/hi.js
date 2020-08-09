
var qs = require('qs')

module.exports = (req, res) => {
  res.statusCode = 200
  res.setHeader('content-type', 'text/plain')
  res.end(JSON.stringify(qs.parse(req.query), null, 2))
}
