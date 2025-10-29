const { HTTP_METHODS } = require('./constants.js')

class RouteNode {
  constructor() {
    // Map of child nodes
    //  key: path segment, value: RouteNode
    this.children = new Map()
    this.handler = new Map()
    this.params = []
  }
}

class Router {
  constructor() {
    this.root = new RouteNode()
  }

  #verifyParams(method, path, handler) {
    if (
      !HTTP_METHODS[method] ||
      typeof path !== 'string' ||
      path[0] !== '/' ||
      typeof handler !== 'function'
    ) {
      throw new Error(
        'Invalid argument types: path must be a string and handler must be a function'
      )
    }
  }

  #addRoute(method, path, handler) {
    this.#verifyParams(method, path, handler)

    let currentNode = this.root
    let routeParts = path.split('/').filter(Boolean)
    let dynamicParams = []

    for (let part of routeParts) {
      const isDynamic = part.startsWith(':')
      if (isDynamic) {
        dynamicParams.push(part.slice(1))
      }

      const key = isDynamic ? ':' : part

      if (!currentNode.children.has(key)) {
        currentNode.children.set(key, new RouteNode())
      }
      currentNode = currentNode.children.get(key)
    }

    currentNode.handler.set(method, handler)
    currentNode.params = dynamicParams
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

  options(path, handler) {
    this.#addRoute(HTTP_METHODS.OPTIONS, path, handler)
  }

  connect(path, handler) {
    this.#addRoute(HTTP_METHODS.CONNECT, path, handler)
  }

  trace(path, handler) {
    this.#addRoute(HTTP_METHODS.TRACE, path, handler)
  }

  findRoute(path, method) {
    let currentNode = this.root
    let routeParts = path.split('/').filter(Boolean)
    let extractedParams = []

    for (let part of routeParts) {
      let childNode = currentNode.children.get(part)

      if (childNode) currentNode = childNode
      childNode = currentNode.children.get(':')

      if (childNode) {
        currentNode = childNode
        extractedParams.push(part)
      } else {
        return null
      }
    }

    let params = Object.create(null)

    currentNode.params.forEach((paramName, index) => {
      params[paramName] = extractedParams[index]
    })

    return {
      params,
      handler: currentNode.handler.get(method)
    }
  }

  printTree(node = this.root, indentation = 0) {
    const indent = '-'.repeat(indentation)
    node.children.forEach((childNode, part) => {
      console.log(`${indent}${part} Dynamic: ${childNode.params}`)
      this.printTree(childNode, indentation + 1)
    })
  }
}

module.exports = { Router }
