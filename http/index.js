const { createServer } = require('node:http')
const { Router } = require('./lib/router')

function run(router, port) {
  if (!(router instanceof Router)) {
    throw new Error('Invalid router instance')
  }

  if (typeof port !== 'number' || port <= 0 || port >= 65536) {
    throw new Error('Invalid port number')
  }

  createServer(function _create(req, res) {
    const route = router.findRoute(req.url, req.method)

    if (route?.handler) {
      req.params = route.params
      route.handler(req, res)
    } else {
      res.statusCode = 404
      res.end('Not Found')
    }
  }).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
    console.log(`Available routes:
      ${[...router.root.children.keys()].join('\n')}    `)
  })
}

module.exports = { Router, run }
