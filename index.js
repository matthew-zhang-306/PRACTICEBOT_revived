const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");

const client = new Discord.Client();

// Creates managers for each game in the directory
let cmds = {};
fs.readdir(config.commandDir, (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let func = require(config.commandDir + file);
        let name = file.split(".")[0];
        cmds[name] = func;
    });
});
const commands = cmds;


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', message => {

    // Exit if not a bot command
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;

    let terms = message.content.substr(config.prefix.length).trim().split(/ +/g);
    let command = terms.shift().toLowerCase();

    if (commands == "help") {
        message.channel.send(config.helpMessage);
    }
    else if (commands[command] == null || commands[command] == undefined) {
        message.channel.send(config.errorMessage);
    }
    else {
        try {
            commands[command].manageGame(message, terms);
        } catch (err) {
            console.error(err);
        }
    }

});

client.login(config.token); // ERASE THE TOKEN IN CONFIG BEFORE MAKING GIT COMMITS