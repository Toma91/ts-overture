export interface Logger {
    log(...data: any[]): void
}

export function message(text: string, logger: Logger = console): void {
    logger.log(`[message lib] ${text}`)
}
