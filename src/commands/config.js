import chalk from 'chalk'
import { homedir } from 'os'
import { writeFileSync } from 'fs'
const configPath = `${homedir()}/.nodebot.json`
export default {
    args: '[name] [value]',
    options: [],
    /**
     * query or modify nodebot-cli's configuration
     * @param {{write: function, question: function, exec: function}} cli 
     * @param {any} config
     * @param {{name?: string, value?: string}} args
     */
    async action(cli, config, { name, value }) {
        const prevDir = process.cwd()
        process.chdir(__dirname)
        if (name && value) {
            cli.write(chalk.blue(`Writing value... `))
            config[name] = value
            try {
                writeFileSync(configPath, JSON.stringify(config))
                cli.write(chalk.green(`Succesfully wrote config. `))
            } catch (err) {
                cli.write(chalk.red(`Don\'t have permission when operating in ${config.path}. `))
                throw err
            } finally { process.chdir(prevDir) }
            cli.write(chalk.blue(`Restart CLI to apply these changes. `))
        } else {
            cli.write(chalk.blue(`Getting value(s)... `))
            if (name) cli.write(`${name} => ${config[name]}`)
            else cli.write(config)
        }
        process.chdir(prevDir)
    }
}