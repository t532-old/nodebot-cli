export default {
    args: '',
    options: [],
    /**
     * exit the process
     * @param {any} cli
     */
    async action(cli) {
        cli.write('Exiting...')
        process.exit()
    }
}