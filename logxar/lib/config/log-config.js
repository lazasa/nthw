const fs = require('fs')
const { RollingConfig } = require('./rolling-config')
const { LogLevel } = require('../utils/log-level')

class LogConfig {
  #level = LogLevel.Info
  #rolling_config = RollingConfig.Hourly
  #file_prefix = 'logxar_'

  constructor() {
    this.#rolling_config = RollingConfig.with_defaults()
  }

  static assert(log_config) {
    if (arguments.length > 0 && !(log_config instanceof LogConfig)) {
      throw new Error(
        `log_config must be an instance of LogConfig. Unsupported param ${JSON.stringify(
          log_config
        )}`
      )
    }
  }

  static from_json(json) {
    let log_config = new LogConfig()

    Object.keys(json).forEach(key => {
      switch (key) {
        case 'level':
          log_config = log_config.with_log_level(json[key])
          break
        case 'rolling_config':
          log_config = log_config.with_rolling_config(json[key])
          break
        case 'file_prefix':
          log_config = log_config.with_file_prefix(json[key])
          break
      }
    })

    return log_config
  }

  static from_file(file_path) {
    const file_contents = fs.readFileSync(file_path, 'utf-8')
    return LogConfig.from_json(JSON.parse(file_contents))
  }

  static with_defaults() {
    return new LogConfig()
  }

  get level() {
    return this.#level
  }

  get rolling_config() {
    return this.#rolling_config
  }

  get file_prefix() {
    return this.#file_prefix
  }

  with_log_level(log_level) {
    LogLevel.assert(log_level)
    this.#level = log_level
    return this
  }

  with_rolling_config(rolling_config) {
    this.#rolling_config = RollingConfig.from_json(rolling_config)
    return this
  }

  with_file_prefix(file_prefix) {
    if (typeof file_prefix !== 'string' || file_prefix.length === 0) {
      throw new Error(
        `file_prefix must be a non-empty string. Unsuported param ${JSON.stringify(
          file_prefix
        )}`
      )
    }

    this.#file_prefix = file_prefix
    return this
  }
}

module.exports = {
  LogConfig
}
