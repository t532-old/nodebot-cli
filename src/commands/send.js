import API_DESCRIPTION from '../../api-description.json'
import { post } from 'axios'
import chalk from 'chalk'
export default {
    args: '[name]',
    options: [],
    /**
     * use bot api to interact with cqhttp
     * @param {{write: function, question: function, exec: function}} cli 
     * @param {any} config
     * @param {{name?: string}} args
     */
    async action(cli, config, { name }) {
        if (name) {
            if (config.apiPort) {
                if (name in API_DESCRIPTION) {
                    const request = { name, params: [] }
                    cli.write(`${chalk.gray(`${name} ::`)} ${API_DESCRIPTION[name].description}`)
                    for (let i of API_DESCRIPTION[name].params) {
                        if (i === 'message') {
                            cli.write('Start entering message. 2 adjacent \\n means the end of the message.')
                            let message = ''
                            while (1) {
                                const line = await cli.question(chalk.gray('>>> '))
                                if (line) message += (line + '\n')
                                else break
                            }
                            if (message.endsWith('\n')) message = message.slice(0, message.length - 1)
                            request.params.push(message)
                        } else request.params.push(await cli.question(chalk.gray(`${i} >>> `)))
                    }
                    cli.write(chalk.blue(`Request sent >>> `))
                    const result = (await post(`http://localhost:${config.apiPort}`, request)).data
                    cli.write(result)
                    if (result.status === 'ok') cli.write(`${chalk.green(`Success <<<`)} ${chalk.gray('Check upper response for more info.')} `)
                    else if (result.status === 'failed') cli.write(`${chalk.yellow(`Request failed because of CoolQ somehow <<<`)} ${chalk.gray('Check upper response for more info.')} `)
                    else if (result.status === 'ierror') cli.write(`${chalk.red(`Request failed because of nodebot's error <<<`)} ${chalk.gray('Check upper response for more info.')} `)
                } else {
                    cli.write(chalk.red(`Operation \`${name}\` doesn't exist.`))
                    throw new Error('Operation not found')
                }
            } else {
                cli.write(chalk.red('You haven\'t specified `apiPort` in config.'))
                cli.write(chalk.red('Use `config apiPort {nodebot API port}` to set the api port.'))
                throw new Error('apiPort not specified')
            }
        } else
            for (let i of Object.keys(API_DESCRIPTION))
                cli.write(`${chalk.gray(`${i} ::`)} ${API_DESCRIPTION[i].description}`)
    }
}