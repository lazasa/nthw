const { LogConfig, Logger } = require('./index')
const path = require('node:path')

async function initialize() {
  const logger = Logger.with_config(
    LogConfig.from_file(path.join(__dirname, 'config.json'))
  )
  await logger.init()

  return logger
}

async function main() {
  let logger = await initialize()

  setInterval(() => {
    logger.critical('This is a critical message')
  }, 20)
}

main()
