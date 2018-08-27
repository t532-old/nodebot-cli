import chalk from 'chalk'
import { version as cliVersion } from '../../package.json'
import { safeLoad } from 'js-yaml'
import { readFileSync } from 'fs'
async function getModuleList(config) {
    const { version: botVersion } = require(`${config.path}/package.json`)
    const exportList = safeLoad(readFileSync(`config/exports.yml`))
    const versionList = [`nodebot@${botVersion}`, `nodebot-cli@${cliVersion}`]
    let modules = []
    for (let i of Object.keys(exportList))
        for (let j of exportList[i])
            modules.push(j)
    modules = new Set(modules)
    for (let i of modules) {
        const { version } = require(`${config.path}/node_modules/nodebot-module-${i}/package.json`)
        versionList.push(`nodebot-module-${i}@${version}`)
    }
    return { versionList, exportList }
}

export default {
    args: '',
    options: [],
    /**
     * lists the version info of nodebot
     * @param {{write: function, question: function, exec: function}} cli 
     * @param {any} config
     */
    async action(cli, config) {
        const prevDir = process.cwd()
        process.chdir(config.path)
        cli.write(chalk.blue(`Loading configuration... `))
        try {
            const modules = await getModuleList(config)
            cli.write(modules.versionList)
            cli.write(modules.exportList)
        } catch (err) { throw err }
          finally { process.chdir(prevDir) }
    }
}