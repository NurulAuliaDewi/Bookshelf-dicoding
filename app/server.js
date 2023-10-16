const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
    });

    server.route(routes);
    await server.start();
    console.log('Server berjalan di port 9000');
}

module.exports = init