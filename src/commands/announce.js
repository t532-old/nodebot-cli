import { post } from 'axios'
import chalk from 'chalk'
export default {
    args: '[groups...]',
    options: ['include', 'except'],
    /**
     * Runs a batch command
     * @param {ContentMessage} msg The universal msg object
     * @param {{ groups: string[] }} - the announcement info
     * @param {string[]} type - the filter type
     */
    async action(cli, config, { groups }, [ type ]) {
        cli.write('Start entering announcement. 2 adjacent \\n means the end of the message.')
        let announcement = ''
        while (1) {
            const line = await cli.question(chalk.gray('> '))
            if (line) announcement += (line + '\n')
            else break
        }
        if (announcement.endsWith('\n')) announcement = announcement.slice(0, announcement.length - 1)
        const groupList = (await post(`http://localhost:${config.apiPort}`, { name: 'groupList', params: [] })).data.map(i => i.group_id.toString())
        for (let i of groupList)
            if (
                (type === 'include' && groups.includes(i)) ||
                (type === 'except' && !groups.includes(i)) ||
                !type
            ) {
                cli.write(chalk.blue(`Send to ${i} >>>`))
                const result = (await post(`http://localhost:${config.apiPort}`, { name: 'group', params: [i, announcement] })).data
                cli.write(result)
                if (result.status === 'ok') cli.write(`${chalk.green(`Success <<<`)} ${chalk.gray('Check upper response for more info.')} `)
                else if (result.status === 'failed') cli.write(`${chalk.yellow(`Request failed because of CoolQ somehow <<<`)} ${chalk.gray('Check upper response for more info.')} `)
                else if (result.status === 'ierror') cli.write(`${chalk.red(`Request failed because of nodebot's error <<<`)} ${chalk.gray('Check upper response for more info.')} `)
            }
    }
}