import express from 'express'
import JsonStorage from '../packages/json-storage'
import { UpdaterApplication } from '../packages/core/src'
import { BasicGuard } from '../packages/core/src/BasicGuard';

const app = express()

const updater = new UpdaterApplication({
    guards: [
        new BasicGuard({
            scope: ['publish'],
            users: {
                root: 'root'
            }
        })
    ],
    storage: new JsonStorage({ app })
})

updater.initInApp(app)

app.listen(5858, () => {
    console.log('Update server is alive!')
})