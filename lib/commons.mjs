import { existsSync, mkdirSync } from 'fs'
import * as path from 'path'

export function init(options) {
    options = options || {}

    options.storagePath = options.storagePath || 'data'
    options.queuePath = path.join(options.storagePath, 'queue')
    options.errorPath = path.join(options.storagePath, 'error')
    options.runningPath = path.join(options.storagePath, 'running')
    options.donePath = path.join(options.storagePath, 'done')

    let mkOptions = { recursive: true }

    !existsSync(options.storagePath) && mkdirSync(options.storagePath, mkOptions)
    !existsSync(options.queuePath) && mkdirSync(options.queuePath, mkOptions)
    !existsSync(options.errorPath) && mkdirSync(options.errorPath, mkOptions)
    !existsSync(options.runningPath) && mkdirSync(options.runningPath, mkOptions)
    !existsSync(options.donePath) && mkdirSync(options.donePath, mkOptions)

    return options
}
