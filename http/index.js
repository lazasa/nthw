const http = require('node:http')

const PORT = 5255

const routeHandlers = {
  'GET /': () => ({
    statusCode: 200,
    data: 'Hello, World!',
    headers: { 'My-Header': 'MyHeaderValue' }
  }),
  'POST /echo': () => ({
    statusCode: 201,
    data: 'Echoing your POST request!',
    headers: { 'My-Header': 'MyHeaderValue' }
  })
}

const baseHeaders = {
  'Content-Type': 'text/plain; charset=utf-8',
  Connection: 'close'
}

/**
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function handleRequest(req, res) {
  const { method, url } = req
  const handler =
    routeHandlers[`${method} ${url}`] ||
    (() => ({
      statusCode: 404,
      data: 'Not Found',
      headers: { 'My-Header': 'NotFound' }
    }))

  const { statusCode, data, headers: headersFromHandler } = handler()

  headers = {
    ...baseHeaders,
    ...headersFromHandler,
    'Content-Length': Buffer.byteLength(data)
  }

  res.writeHead(statusCode, headers)

  res.end(`
    Request method: ${req.method}
    Request URL: ${req.url}
    Response headers: ${JSON.stringify(res.getHeaders(), null, 2)}
  `)
}

const server = http.createServer(handleRequest)

server.listen(PORT, () => {
  console.log(`HTTP server is running on http://localhost:${PORT}`)
})
