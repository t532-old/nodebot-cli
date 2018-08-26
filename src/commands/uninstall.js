import chalk from 'chalk'
import { safeLoad, safeDump } from 'js-yaml'
import { readFileSync, writeFileSync } from 'fs'
async function uninstallModule(cli, config, name) {
    const shortName = name.split(/nodebot-|module-/).filter(i => i)[0],
        fullName = `nodebot-module-${shortName}`
    cli.write(chalk.blue(`Reverting configuration... `))
    const exportList = safeLoad(readFileSync(`config/exports.yml`))
    for (let i of Object.keys(exportList))
        if (exportList[i].includes(shortName)) 
            exportList[i].splice(exportList[i].indexOf(shortName), 1)
    try { writeFileSync(`config/exports.yml`, safeDump(exportList)) }
    catch (err) {
        cli.write(chalk.red(`Error occured when reverting export config. check permission in ${config.path}. `))
        throw err
    }
    cli.write(chalk.blue(`Uninstalling module... `))
    try { await cli.exec(/^win/.test(process.platform) ? `${config.pm}.cmd` : config.pm, ['install', fullName]) } 
    catch (err) {
        cli.write(chalk.red(`Error occured when uninstalling package ${fullName}. `))
        throw err
    }
    cli.write(chalk.green(`Successfully uninstalled module ${shortName}. `))
}

export default {
    args: '<name>',
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
        try { await uninstallModule(cli, config, name) } 
        catch {
            cli.write(chalk.bgRed.white(`Error occured. Exiting command \`uninstall\`. `))
            process.chdir(prevDir)
            return
        }
        cli.write(chalk.blue(`Restart nodebot to apply these changes. `))
        cli.write(chalk.bgGreen.black(` Success. Exiting command \`uninstall\`. `))
        process.chdir(prevDir)
    }
}