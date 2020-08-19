import { init } from '../lib/commons.mjs'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import url from 'url'

async function main() {
    let options = init({
        url: 'http://compras.dados.gov.br/fornecedores/v1/fornecedores.json'
    })

    try {
        console.debug(`Baixando index de ${options.url}...`)
        let result = await axios.get(options.url, {
            timeout: 5 * 60 * 1000
        })

        console.debug('Index obtido:', result.data)

        if (!result?.data?.count) {
            console.error('Count não informado!')
            process.exit(1)
        }

        if (!result?.data?._links?.next?.href) {
            console.error('Próxima página não informada!')
            process.exit(2)
        }

        let count = result.data.count
        let recordsPerPage = 200
        let nextUrl = url.parse(result.data._links.next.href)

        if (nextUrl?.query?.trim() !== '') {
            let countTmp = nextUrl.query.trim().split('=')[1]

            countTmp = parseInt(countTmp)

            if (typeof countTmp === 'number' && countTmp)
                recordsPerPage = countTmp
        }

        let totalPages = Math.ceil(count / recordsPerPage);

        console.info(`Identificados ${count} registro(s) a obter`)
        console.info(`Próxima Url: ${nextUrl.query}`)
        console.info(`Registros por página: ${recordsPerPage}`)

        function* gen() {
            let current = 0;
            while (current < totalPages)
                yield current++
        }

        console.info('Gravando fila...')
        for (let i of gen()) {
            let filePath = path.join(options.queuePath, `page-${i}`)

            // TODO: Melhorar criação do arquivo vazio
            // TODO: Imprimir que está gerando arquivos
            let fh = fs.openSync(filePath, 'w')
            fs.closeSync(fh)
        }

        console.info(`Index gravado com ${totalPages} itens!`)
        process.exit(0)
    } catch (error) {
        console.error(`Falha ao obter dados da url: ${error}`)
    }
}

main()