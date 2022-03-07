import { Logger, message } from "./message"

describe('A suite is just a function', () => {
    it('and so is a spec', () => {
        const recordedData: any[] = []

        const logger: Logger = {
            log(...data: any[]) {
                recordedData.push(...data)
            }
        }

        message('coconut', logger)
        message('a', logger)
        message('b', logger)
        expect(recordedData).toEqual(['[message lib] coconut', '[message lib] a', '[message lib] b'])
    })
})
