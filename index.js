const mineflayer = require('mineflayer');
const config = require('./config.json');

// Create the bot
const bot = mineflayer.createBot({
    host: config.server.ip,
    port: config.server.port,
    username: config["bot-account"].username,
    version: config.server.version
});

// Auto-authenticate when joining
bot.once('spawn', () => {
    console.log("[INFO] Bot joined the server");
    
    if (config.utils["auto-auth"].enabled) {
        setTimeout(() => {
            bot.chat(`${config.utils["auto-auth"]["login-command"]} ${config.utils["auto-auth"].password}`);
            console.log(`[Auth] Sent ${config.utils["auto-auth"]["login-command"]} command.`);
        }, 2000); // 2 seconds delay to ensure the bot can send the command
    }
});

// Auto-reconnect if kicked
bot.on('end', (reason) => {
    console.log(`[ERROR] Bot disconnected: ${reason}`);
    if (config.utils["auto-reconnect"]) {
        setTimeout(() => {
            console.log("[INFO] Reconnecting...");
            process.exit(1); // Restart bot (use a process manager like PM2 for automatic restart)
        }, config.utils["auto-reconnect-delay"]);
    }
});

// Keep the bot active
bot.on('kicked', (reason) => console.log(`[KICKED] ${reason}`));
bot.on('error', (err) => console.log(`[ERROR] ${err}`));

