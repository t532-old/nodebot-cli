import config from '../config.json'
import Command from './command'
import chalk from 'chalk'
import path from 'path'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { createInterface } from 'readline'
import { version } from '../package.json'
import { spawn } from 'child_process'
const interpreter = new Command({
    prefixes: { options: '-' },
    handlers: {
        default() { write(chalk.red('Command not found \n')) },
        invalid() { write(chalk.red('Bad command format \n')) },
    }
}).onAll
const lineInput = createInterface({
    input: process.stdin,
    output: process.stdout,
})
const welcome = `
nodebot CLI v${version}
by trustgit, https://gitlab.com/trustgit/nodebot-cli

`
function write(query) { lineInput.write(query) }
function question(query) { return new Promise(resolve => lineInput. question(query, answer => resolve(answer))) }
function command(comm, param) { return new Promise((resolve, reject) => spawn(comm, param).on('close', (err, stdout) => { err ? reject(err) : resolve(stdout) })) }
async function install() {
    write(chalk.blue(`Downloading nodebot ... \n`))
    if (!existsSync(config.path)) mkdirSync(config.path)
    try { await command('git', ['clone', config.coreRepo, config.path]) }
    catch {
        write(chalk.red(`Error occured when downloading nodebot. Try deleting everything in ${config.path} and retry. \n`))
        process.exit()
    }
}
async function listen() {
    const command = await question(chalk.gray('nodebot > '))
    interpreter.do(command)
}
async function initialize() {
    let installed = true
    write(welcome)
    if (!config.path) {
        write(`You haven't specified the path for nodebot. \n`)
        installed = (await question(`Have you already installed nodebot on your computer? [${chalk.green('Y')}/${chalk.red('(N)')}] > `)).toLowerCase() === 'y' ? true : false
        config.path = await question(`Specify a path for nodebot > `)
        if (!path.isAbsolute(config.path)) config.path = path.join(process.cwd(), config.path)
        writeFileSync(`${__dirname}/../config.json`, JSON.stringify(config))
    }
    if (!existsSync(`${config.path}/package.json`)) {
        if (installed) write(chalk.red(`nodebot isn't found in ${config.path}. \n`))
        await install()
    }
}
export async function main() { 
    await initialize()
    while (1) await listen()
}