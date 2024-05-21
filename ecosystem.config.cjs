module.exports = {
    apps: [
        {
            name: 'bricast-dashboard-be"',
            script: './build/bin/server.js',
            instances: 'max',
            exec_mode: 'cluster',
            autorestart: true,
        },
    ],
}
