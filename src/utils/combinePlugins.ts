export const combinePlugins = (...plugins) => {
    return {
        install: function*() {
            for (const plugin of plugins) {
                if (plugin.install) {
                    yield* plugin.install();
                }
            }
        },
        commands: plugins.reduce((composition, plugin) => {
            return {
                ...composition,
                ...plugin.commands,
            };
        }, {})
    }
}