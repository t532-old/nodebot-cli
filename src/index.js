import config from '../config.json'
import Command from './command'
import chalk from 'chalk'
import path from 'path'
import * as commands from './commands'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { createInterface } from 'readline'
import { version } from '../package.json'
import { spawn } from 'child_process'
const interpreter = new Command({
    prefixes: { options: '-' },
    handlers: {
        default() { cli.write(chalk.red('Command not found ')) },
        invalid() { cli.write(chalk.red('Bad command format ')) },
    }
}).onAll(commands)
const lineInput = createInterface({
    input: process.stdin,
    output: process.stdout,
})
const welcome = `
nodebot CLI v${version}
by trustgit, https://gitlab.com/trustgit/nodebot-cli
`
const cli = {
    write(query) { console.log(query) },
    question(query) { return new Promise(resolve => lineInput. question(query, answer => resolve(answer))) },
    exec(comm, param, options = { cwd: undefined, env: process.env }) { return new Promise((resolve, reject) => {
        const childProcess = spawn(comm, param, options)
        childProcess.on('close', code => code ? reject(code) : resolve(code))
    }) },
}
async function download() {
    cli.write(chalk.blue(`Downloading nodebot ... `))
    if (!existsSync(config.path)) mkdirSync(config.path)
    try { await cli.exec('git', ['clone', config.coreRepo, config.path]) }
    catch {
        cli.write(chalk.red(`Error occured when downloading nodebot. Try deleting everything in ${config.path} and retry. `))
        process.exit()
    }
    await interpreter.do('install', cli, config)
    cli.write(chalk.blue(`Downloading finished. To start using nodebot, open another shell and type:

    $ cd ${config.path}
    $ npm start
    `))
}
async function listen() {
    const command = await cli.question(chalk.gray('nodebot > '))
    try { await interpreter.do(command, cli, config) }
    catch { cli.write(chalk.bgRed.white(` Error occured. Exiting command. `)) }
    cli.write('')
}
async function initialize() {
    let installed = true
    cli.write(welcome)
    if (!config.path) {
        cli.write(`You haven't specified the path for nodebot. `)
        installed = (await cli.question(`Have you already installed nodebot on your computer? [${chalk.green('Y')}/${chalk.red('(N)')}] > `)).toLowerCase() === 'y' ? true : false
        config.path = await cli.question(`Specify a path for nodebot > `)
        if (!path.isAbsolute(config.path)) config.path = path.join(process.cwd(), config.path)
        cli.write('')
    }
    if (!config.pm) {
        cli.write(`You haven't specified your package manager. `)
        config.pm = await cli.question(`Enter your package manager command (npm) > `)
        cli.write('')
    }
    if (!config.apiPort) {
        cli.write(`You haven't specified your nodebot's API port. `)
        config.apiPort = parseInt(await cli.question(`Enter nodebot's API port in config.yml (empty for none) > `)) || undefined
        cli.write('')
    }
    writeFileSync(`${__dirname}/../config.json`, JSON.stringify(config))
    if (!existsSync(`${config.path}/package.json`)) {
        if (installed) cli.write(chalk.red(`nodebot isn't found in ${config.path}. `))
        await download()
    }
}
export async function main() { 
    await initialize()
    while (1) await listen()
}