const os = require('os');

var ip = function () {
    const networkInterfaces = os.networkInterfaces();
    let ip = null;

    Object.keys(networkInterfaces).forEach((interfaceName) => {
        networkInterfaces[interfaceName].forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                console.log(`Current IP Address: ${iface.address}`);
                ip = iface.address;
            }
        });
    });
    return ip
}

const currentIP = ip();

module.exports = { currentIP }