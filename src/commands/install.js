import chalk from 'chalk'
import { safeLoad, safeDump } from 'js-yaml'
import { existsSync, readFileSync, writeFileSync} from 'fs'
const EXPORT_FILE_LIST = ['aliases', 'helper']
async function installModule(cli, config, name) {
    const shortName = name.split(/nodebot-|module-/).filter(i => i)[0],
        fullName = `nodebot-module-${shortName}`
    cli.write(chalk.blue(`Fetching module from npm registry... `))
    let succeed = false
    for (let i = 0; i < 3; i++) {
        try { 
            await cli.exec(/^win/.test(process.platform) ? `${config.pm}.cmd` : config.pm, ['install', fullName]) 
            succeed = true
            break
        } catch { cli.write(chalk.yellow(`Error occured when installing package ${fullName}. Keep trying... `)) }
    }
    if (!succeed) {
        cli.write(chalk.red(`Error occured when installing package ${fullName} after 3 retries. `))
        throw new Error('Failed downloading')
    }
    let exportChecker
    try { exportChecker = require(`${config.path}/node_modules/${fullName}`) }
    catch (err) {
        cli.write(chalk.red('Dependency problem occured. Try re-installing dependencies using command `install`.'))
        throw err
    }
    cli.write(chalk.blue(`Writing configuration... `))
    const exportList = safeLoad(readFileSync(`config/exports.yml`))
    for (let i of Object.keys(exportChecker)) {
        if (exportChecker[i] && !exportList[i].includes(shortName)) exportList[i].push(shortName)
        else if (!exportChecker[i] && exportList[i].includes(shortName)) exportList[i].splice(exportList[i].indexOf(shortName), 1)
    }
    for (let i of EXPORT_FILE_LIST) {
        if (existsSync(`node_modules/${fullName}/${i}.yml`)&& !exportList[i].includes(shortName)) exportList[i].push(shortName)
        else if (!existsSync(`node_modules/${fullName}/${i}.yml`) && exportList[i].includes(shortName)) exportList[i].splice(exportList[i].indexOf(shortName), 1)
    }
    try { writeFileSync(`config/exports.yml`, safeDump(exportList)) }
    catch (err) {
        cli.write(chalk.red(`Error occured when writing export config. check permission in ${config.path}. `))
        throw err
    }
    cli.write(chalk.green(`Successfully installed module ${shortName}. `))
}
async function installDependencies(cli, config) {
    cli.write(chalk.blue(`Downloading nodebot's dependencies... `))
    try { await cli.exec(/^win/.test(process.platform) ? `${config.pm}.cmd` : config.pm, ['install']) }
    catch (err) {
        cli.write(chalk.red(`Error occured when installing nodebot's dependencies. Try deleting everything in ${config.path} and retry. `))
        throw err
    }
}
export default {
    args: '[name]',
    options: [],
    /**
     * downloads a module for nodebot
     * @param {{write: function, question: function, exec: function}} cli 
     * @param {any} config
     * @param {{name: string}} args
     */
    async action(cli, config, { name }) {
        const prevDir = process.cwd()
        process.chdir(config.path)
        try {
            if (name) await installModule(cli, config, name) 
            else await installDependencies(cli, config)
        } catch {
            cli.write(chalk.bgRed.white(` Error occured. Exiting command \`install\`. `))
            process.chdir(prevDir)
            return
        }
        cli.write(chalk.blue(`Restart nodebot to apply these changes. `))
        cli.write(chalk.bgGreen.black(` Success. Exiting command \`install\`. `))
        process.chdir(prevDir)
    }
}