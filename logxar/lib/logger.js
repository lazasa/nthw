const fs = require('node:fs/promises')
const path = require('node:path')
const { LogConfig } = require('./config/log-config')
const { LogLevel } = require('./utils/log-level')
const { check_and_create_dir, get_caller_info } = require('./utils/helpers')

class Logger {
  #config
  #log_file_handle

  constructor(log_config) {
    log_config = log_config ?? LogConfig.with_defaults()
    LogConfig.assert(log_config)
    this.#config = log_config
  }

  async init() {
    const log_dir_path = check_and_create_dir('logs')

    const file_name =
      this.#config.file_prefix +
      new Date().toISOString().replace(/[\.:]+/g, '-') +
      '.log'

    this.#log_file_handle = await fs.open(
      path.join(log_dir_path, file_name),
      'a+'
    )
  }

  static with_config(log_config) {
    return new Logger(log_config)
  }

  static with_defaults() {
    return new Logger()
  }

  get level() {
    return this.#config.level
  }

  get file_prefix() {
    return this.#config.file_prefix
  }

  get time_threshold() {
    return this.#config.rolling_config.time_threshold
  }

  get size_threshold() {
    return this.#config.rolling_config.size_threshold
  }

  async #rolling_check() {
    const { size_threshold, time_threshold } = this.#config.rolling_config

    const { size, birthtimeMs } = await this.#log_file_handle.stat()
    const current_time = new Date().getTime()

    if (
      size >= size_threshold ||
      current_time - birthtimeMs >= time_threshold * 1000
    ) {
      await this.#log_file_handle.close()
      await this.init()
    }
  }

  async #write_to_handle(msg, level) {
    const date_iso = new Date().toISOString()
    const level_string = LogLevel.to_string(level)

    const log_message = `[${date_iso}] [${level_string}]: ${get_caller_info()} ${msg}\n`
    await this.#log_file_handle.write(log_message)
  }

  async #log(msg, level) {
    if (level < this.#config.level || !this.#log_file_handle.fd) {
      return
    }

    await this.#write_to_handle(msg, level)
    await this.#rolling_check()
  }

  debug(msg) {
    this.#log(msg, LogLevel.Debug)
  }

  info(msg) {
    this.#log(msg, LogLevel.Info)
  }

  warn(msg) {
    this.#log(msg, LogLevel.Warn)
  }

  error(msg) {
    this.#log(msg, LogLevel.Error)
  }

  critical(msg) {
    this.#log(msg, LogLevel.Critical)
  }
}

module.exports = {
  Logger
}
