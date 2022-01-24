module.exports = [
    {
        entry: './dist/mod.js',
        experiments: {
            outputModule: true
        },
        mode: 'production',
        output: {
            filename: 'mod.js',
            library: {
                type: 'module'
            },
            module: true,
            path: __dirname
        }
    },
    {
        entry: './dist/mod.js',
        mode: 'production',
        output: {
            filename: 'mod.c.js',
            library: {
                type: 'commonjs2'
            },
            path: __dirname
        },
        target: 'webworker'
    }
]