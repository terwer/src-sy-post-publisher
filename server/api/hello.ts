import logUtil from "~/utils/logUtil";

export default defineEventHandler((event) => {
    const env = useRuntimeConfig()
    const logger = logUtil(env.logLevel);
    logger.logInfo('Runtime env:', env.logLevel)
    logger.logWarn('Runtime env:', env.logLevel)
    logger.logError('Runtime env:', env.logLevel)

    return {
        api: 'works'
    }
})