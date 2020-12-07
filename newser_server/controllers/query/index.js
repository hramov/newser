'use strict'

import { localFileProvider, serverProvider } from './../../providers'
import { log } from './../../logger'

export async function getQuery(source) {
    let result = {}

    switch (source) {
        case 'server':
            let localFileProviderData = await localFileProvider()
            if (localFileProviderData === null) {
                let serverProviderData = await serverProvider()
                result.query = serverProviderData.query
                result.id_request = serverProviderData.id_request
                result.engines = serverProviderData.engines
            } else {
                result.query = localFileProviderData.query
                result.id_request = localFileProviderData.id_request
                result.engines = localFileProviderData.engines
            }
            break
        case 'file':
            result.query = localFileProviderData.query
            result.id_request = localFileProviderData.id_request
            break;
        default:
            log('Источник не определен')
    }
    return result
}