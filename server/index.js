const express = require('express')
const next = require('next')
const compression = require('compression')

const createRoutes = require('./routes')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})

app.prepare().then(() => {
  const server = express()

  if (!dev) {
    server.use(compression())
  }

  server.use('/', createRoutes(app))

  server.listen(port, err => {
    if (err) {
      throw err
    }

    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`)
  })
})
