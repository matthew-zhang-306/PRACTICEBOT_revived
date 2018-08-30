const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs")
const eightball = require("./eightball.js");
const tictac = require("./tictac.js");


const client = new Discord.Client();

client.on('ready', () => {
    console.log('Logged in as ${client.user.tag}');
});

client.on('message', message => {

    // Exit if not a bot command
    if(!msg.content.startsWith(prefix) || message.author.bot) return;

    let terms = message.content.substr(config.prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    switch (command) {
        // HELP
        case 'help':
            message.author.send(config.helpMessage);
            break;
        
        // MAGIC 8 BALL
        case '8ball':
            eightball.manageGame(message, terms);
            break;

        // TIC TAC TOE (or noughts and crosses, for brits)
        case 'tictac':
            tictac.manageGame(message, terms);
            break;
        
        default:
            message.channel.send(config.errorMessage);
    }
});

client.login(config.token);