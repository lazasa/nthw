class LogLevel {
  static #Debug = 0
  static #Info = 1
  static #Warn = 2
  static #Error = 3
  static #Critical = 4

  static get Debug() {
    return LogLevel.#Debug
  }

  static get Info() {
    return LogLevel.#Info
  }

  static get Warn() {
    return LogLevel.#Warn
  }

  static get Error() {
    return LogLevel.#Error
  }

  static get Critical() {
    return LogLevel.#Critical
  }

  static assert(log_level) {
    if (
      ![
        LogLevel.Debug,
        LogLevel.Info,
        LogLevel.Warn,
        LogLevel.Error,
        LogLevel.Critical
      ].includes(log_level)
    ) {
      throw new Error(
        `Invalid log level: ${log_level}. log_level must be an instance of LogLevel.`
      )
    }
  }

  static to_string(log_level) {
    const levelMap = {
      [LogLevel.Debug]: 'DEBUG',
      [LogLevel.Info]: 'INFO',
      [LogLevel.Warn]: 'WARN',
      [LogLevel.Error]: 'ERROR',
      [LogLevel.Critical]: 'CRITICAL'
    }

    if (levelMap.hasOwnProperty(log_level)) return levelMap[log_level]

    throw new Error(`Invalid log level: ${log_level}`)
  }
}

module.exports = {
  LogLevel
}
