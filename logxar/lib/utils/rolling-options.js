class RollingSizeOptions {
  static OneKB = 1024
  static FiveKB = 5 * 1024
  static TenKB = 10 * 1024
  static TwentyKB = 20 * 1024
  static FiftyKB = 50 * 1024
  static HundredKB = 100 * 1024

  static HalfMB = 512 * 1024
  static OneMB = 1024 * 1024
  static FiveMB = 5 * 1024 * 1024
  static TenMB = 10 * 1024 * 1024
  static TwentyMB = 20 * 1024 * 1024
  static FiftyMB = 50 * 1024 * 1024
  static HundredMB = 100 * 1024 * 1024

  static assert(size_threshold) {
    if (
      typeof size_threshold !== 'number' ||
      size_threshold < RollingSizeOptions.OneKB
    ) {
      throw new Error(
        `size_threshold must be at least ${
          RollingSizeOptions.OneKB
        }. Unsupported param ${JSON.stringify(size_threshold)}`
      )
    }
  }
}

class RollingTimeOptions {
  static Minutely = 60
  static Hourly = 60 * 60
  static Daily = 60 * 60 * 24
  static Weekly = 60 * 60 * 24 * 7
  static Monthly = 60 * 60 * 24 * 30
  static Yearly = 60 * 60 * 24 * 30 * 12

  static assert(time_threshold) {
    if (
      ![
        RollingTimeOptions.Minutely,
        RollingTimeOptions.Hourly,
        RollingTimeOptions.Daily,
        RollingTimeOptions.Weekly,
        RollingTimeOptions.Monthly,
        RollingTimeOptions.Yearly
      ].includes(time_threshold)
    ) {
      throw new Error(
        `time_threshold must be one of the predefined RollingTimeOptions. Unsupported param ${JSON.stringify(
          time_threshold
        )}`
      )
    }
  }
}

module.exports = {
  RollingTimeOptions,
  RollingSizeOptions
}
