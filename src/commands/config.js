import chalk from 'chalk'
import { writeFileSync } from 'fs'
export default {
    args: '[name] [value]',
    options: [],
    /**
     * downloads a module for nodebot
     * @param {{write: function, question: function, exec: function}} cli 
     * @param {any} config
     * @param {{name: string}} args
     */
    async action(cli, config, { name, value }) {
        const prevDir = process.cwd()
        process.chdir(__dirname)
        if (name && value) {
            cli.write(chalk.blue(`Writing value... `))
            config[name] = value
            try {
                writeFileSync('../../config.json', JSON.stringify(config))
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