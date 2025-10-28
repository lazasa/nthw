const http = require('node:http')

const PORT = 5255

const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  CONNECT: 'CONNECT',
  TRACE: 'TRACE'
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  insert(wordToInsert, node = this.root) {
    let length = wordToInsert.length
    if (length == 0) return

    const letters = wordToInsert.split('')

    const foundNode = node.children.get(wordToInsert[0])

    if (foundNode) {
      this.insert(letters.slice(1).join(''), foundNode)
    } else {
      let insertedNode = node.add(letters[0], length == 1)
      this.insert(letters.slice(1).join(''), insertedNode)
    }
  }
}

class TrieNode {
  constructor() {
    this.isEndOfWord = false
    this.children = new Map()
  }

  add(letter, _isLastCharacter) {
    let newNode = new TrieNode()
    this.children.set(letter, newNode)

    if (_isLastCharacter) newNode.isEndOfWord = true
    return newNode
  }
}

class Router {
  constructor() {
    this.routes = new Map()
  }

  #addRoute(method, path, handler) {
    if (typeof path !== 'string' || typeof handler !== 'function') {
      throw new Error(
        'Invalid argument types: path must be a string and handler must be a function'
      )
    }

    this.routes.set(`${method} ${path}`, handler)
  }

  printRoutes() {
    console.log('Registered routes: %o', this.routes)
  }

  handleRequest(req, res) {
    const { url, method } = req
    const handler = this.routes.get(`${method} ${url}`)

    if (!handler) {
      return console.log('404 not found')
    }

    handler(req, res)
  }

  get(path, handler) {
    this.#addRoute(HTTP_METHODS.GET, path, handler)
  }

  post(path, handler) {
    this.#addRoute(HTTP_METHODS.POST, path, handler)
  }

  put(path, handler) {
    this.#addRoute(HTTP_METHODS.PUT, path, handler)
  }

  delete(path, handler) {
    this.#addRoute(HTTP_METHODS.DELETE, path, handler)
  }

  patch(path, handler) {
    this.#addRoute(HTTP_METHODS.PATCH, path, handler)
  }

  head(path, handler) {
    this.#addRoute(HTTP_METHODS.HEAD, path, handler)
  }

  options(path, handler) {
    this.#addRoute(HTTP_METHODS.OPTIONS, path, handler)
  }

  connect(path, handler) {
    this.#addRoute(HTTP_METHODS.CONNECT, path, handler)
  }

  trace(path, handler) {
    this.#addRoute(HTTP_METHODS.TRACE, path, handler)
  }
}

const baseHeader = {
  'Content-Type': 'application/json; charset=utf-8',
  Connection: 'close'
}

const router = new Router()

router.get('/', function handleBaseGet(req, res) {
  res.writeHead(200, baseHeader)
  res.end(JSON.stringify({ message: 'Hello, World!' }))
})

router.get('/about', function handleAboutGet(req, res) {
  res.writeHead(200, baseHeader)
  res.end(JSON.stringify({ message: 'About Page' }))
})

const server = http
  .createServer((req, res) => router.handleRequest(req, res))
  .listen(PORT)
