const { Router, run } = require('./http')

const PORT = 5255

const router = new Router()

router.get('/users/:id', (req, res) => {
  const userId = req.params.id
  res.end(`User ID: ${userId}`)
})

router.post('/users', (req, res) => {
  res.end('User created')
})

run(router, PORT)
