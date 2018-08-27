import HELP_DOC from '../../help.json'
export default {
    args: '',
    options: [],
    /**
     * exit the process
     * @param {any} cli
     */
    async action(cli) {
        cli.write(HELP_DOC.about)
        cli.write('')
        for (let i of HELP_DOC.commands) {
            cli.write(i.name)
            i.description.split('\n').map(i => `    ${i}`).forEach(cli.write)
            cli.write('')
        }
    }
}