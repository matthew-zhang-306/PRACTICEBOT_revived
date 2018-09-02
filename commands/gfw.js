/*
GRASS FIRE WATER
*/

// Intro blurb
const listOfCommands =
    "e!gfw new: enter a new battle of grass fire water as player 1\n" +
    "e!gfw challenge: enter a new battle of grass fire water as player 2\n" +
    "e!gfw play [code]: send out a Pokemon of one of the three types, hidden to the other player by a code name";
const intro = {
    "embed": {
        "color": 16700208,
        "thumbnail": {
            "url": "http://orig14.deviantart.net/52b2/f/2012/311/2/a/grass__fire__water__swirls_of_black_and_white_by_i_liek_dittos-d5kb4zp.png"
        },
        "fields": [
            {
                "name": "e!gfw",
                "value": "Rock paper scissors, except Pokemon. A game of luck for beginners and psychology for pros."
            },
            {
                "name": "Commands",
                "value": listOfCommands
            },
            {
                "name": "[Image made by i-like-dittos](https://www.deviantart.com/i-liek-dittos/art/Grass-Fire-Water-Swirls-of-Black-and-White-336442885)",
                "value": "It's unova, deal with it"
            }
        ]
    }
}

// Game stuff
const pokemon = [
    ["Bulbasaur","Chikorita","Treecko","Turtwig","Snivy","Chespin","Rowlet"],
    ["Charmander","Cyndaquil","Torchic","Chimchar","Tepig","Fennekin","Litten"],
    ["Squirtle","Totodile","Mudkip","Piplup","Oshawott","Froakie","Popplio"]
]
const winBlurb = {
    "Bulbasaur": "Bulbasaur is too humble to have his own winning blurb, but they won!",
    "Chikorita": "Chikorita really whipped their opponent into shape.",
    "Treecko": "Treecko looks to their poster of EoS Grovyle and says, \"One day I'll be like you, senpai.\"",
    "Turtwig": "\"Whoops, that was an accident,\" Turtwig says.",
    "Snivy": "Confirming once again which Pokemon is calm and very smart.",
    "Chespin": "CHE! CHE! CHESPIN!",
    "Rowlet": "And Rowlet went back to sleep. ZZZZZZZZ",
    "Charmander": "What do you wanna be when you grow up, Charmander? Mega X or Mega Y?",
    "Cyndaquil": "Cyndaquil looks into the opponent's eyes. If only the opponent could do the same.",
    "Torchic": "Who would've thought that Torchic, the big chicken without arms, would win?",
    "Chimchar": "I have zero emotional connection with Chimchar so have this instead of a winning blurb.",
    "Tepig": "The fire type, the friend, the fire pig - Tepig wins again.",
    "Fennekin": "Fennekin invited their crush Riolu to the battle and they are thoroughly impressed.",
    "Litten": "Litten scoffs at the opponent. Weak.",
    "Squirtle": "All that firefighting training really payed off for Squirtle.",
    "Totodile": "Pawel approves of Totodile's victory.",
    "Mudkip": "Now everyone will liek mudkips.",
    "Piplup": "Piplup places its flipper on its chest and poses pretentiously.",
    "Oshawott": "Oshawott sheaths its sword. Turns out they've got a lot to offer.",
    "Froakie": "Froakie just stares blankly. I bet they're thinking about lunch.",
    "Popplio": "Popplio walks up to the opponent and gives them a nice consolation massage."
}
const possibleCodes = ["a","b","c","d","e","1","2","3","4","5","42","rip","owo","uwu","kek","top","fuk","360","win","1f1","wah","bah","nou","1337","mayo","loss","pika","pick","play","fire","grass","water","urgay","[code]","winrar"];
const types = ["GRASS TYPE", "FIRE TYPE", "WATER TYPE"];

const GameState = {PRE: 0, PLAY: 1};
var gameState = GameState.PRE;

var players = [];
var currentPlayer;
var currentPlayerIndex;
const timeoutTime = 60000;
var timeOfLastMove = 0;


// Logic
let initGame = function() {
    players = [
        {user: null, tag: null, hasPlayed: false, selection: 0, pokemon: [], codes: []},
        {user: null, tag: null, hasPlayed: false, selection: 0, pokemon: [], codes: []}
    ];
    currentPlayer = players[0];
    currentPlayerIndex = 0;
}

let initPlayer = function(i, author) {
    players[i].user = author;
    players[i].tag = author.tag;
    players[i].hasPlayed = false;
    players[i].selection = 0;

    for (var t = 0; t < 3; t++) {
        let pick = Math.floor(Math.random() * pokemon[t].length);
        players[i].pokemon[t] = pokemon[t][pick];
    }

    possibleCodes.sort(() => Math.random() - .5); // fancy shuffle
    players[i].codes = possibleCodes.slice(0,3);

    console.log("CODES " + players[i].codes);
}

let gameInProgressCheck = function(message) {
    if (gameState == GameState.PLAY && message.createdTimestamp - timeOfLastMove < timeoutTime) {
        var timeLeft = (timeoutTime - (message.createdTimestamp - timeOfLastMove)) / 1000;
        message.channel.send(`Game in progress. Timeout in ${timeLeft} seconds.`);
        return true;
    }
    return false;
}

let dmPlayers = function(withInit) {
    if (withInit) {
        initPlayer(0, players[0].user);
        initPlayer(1, players[1].user);
    }

    players.forEach(player => {
        let msg = "Use `e!gfw play` to send out your desired Pokemon. Specify the Pokemon's code as described below:\n```";
        for (var t = 0; t < 3; t++)
            msg = msg + `${types[t]}: ${player.pokemon[t]}: ${player.codes[t]}\n`;

        player.user.send(msg + "```");
    });
}

let checkIfValidPlay = function(message, terms) {
    if (gameState == GameState.PRE) { // check if game is playing
        message.channel.send("A battle has not started. Use `e!gfw new` to start a new game or `e!gfw challenge` to join a new game.");
        return false;
    }
    if (terms.length != 2) { // check if there are exactly 2 terms
        message.channel.send("Usage: e!gfw play [code]");
        return false;
    }
    if (players[0].tag != message.author.tag && players[1].tag != message.author.tag) {
        message.channel.send("You are not in the current battle. Wait for it to end and then type `e!gfw new`.");
        return false;
    }
    
    currentPlayer = players[0].tag == message.author.tag ? players[0] : players[1];
    currentPlayerIndex = players[0].tag == message.author.tag ? 0 : 1;

    if (!currentPlayer.codes.includes(terms[1])) {
        message.channel.send(`You do not have a Pokemon code-named ${terms[1]}. Check your DMs again.`);
        return false;
    }

    return true;
}

let getBattleStats = function() {
    let msg = "BATTLE!\n```";
    players.forEach(player => {
        msg = msg +
            `${player.tag} played:\n` +
            `    ${player.pokemon[player.selection]}\n` +
            `    ${types[player.selection]}\n`;
    });
    msg = msg + "```\n";

    let winningPlayer = (players[0].selection - players[1].selection + 3) % 3 - 1; // -1 for draw, 0 for player 1, 1 for player 2

    if (winningPlayer == -1) {
        msg = msg + "Tie! The battle will continue: choose another Pokemon!";
        dmPlayers(true);
    }
    else {
        msg = msg + `@${players[winningPlayer].tag} is victorious! ` + winBlurb[players[winningPlayer].pokemon[players[winningPlayer].selection]];
        gameState = GameState.PRE;
        initGame();
    }

    return msg;
}



initGame();
exports.manageGame = function(message, terms) {

    if (terms.length == 0) { // if no terms, send an introduction
        message.channel.send(intro);
    }
    else switch (terms[0]) {
        case "new":
            if (gameInProgressCheck(message)) break;

            if (players[0].tag != null && message.createdTimestamp - timeOfLastMove < timeoutTime) {
                message.channel.send("Use `e!gfw challenge` to join as a second player.");
            }
            else {
                initGame();
                initPlayer(0, message.author);
                message.channel.send(`@${message.author.tag} would like to battle!`);

                timeOfLastMove = message.createdTimestamp;
            }

            break;
        case "challenge":
            if (gameInProgressCheck(message)) break;

            if (players[0].tag == null) {
                message.channel.send("Use e!gfw new to start a new battle.");
            }
            else if (players[0].tag == message.author.tag) {
                message.channel.send("You can't challenge yourself!");
            }
            else {
                initPlayer(1, message.author);
                gameState = GameState.PLAY;
                message.channel.send(`Let the battle between @${players[0].tag} and @${players[1].tag} begin! Choose your Pokemon.`);
                dmPlayers(false);

                timeOfLastMove = message.createdTimestamp;
            }

            break;
        case "play":
            if (!checkIfValidPlay(message, terms)) break;

            players[currentPlayerIndex].selection = currentPlayer.codes.indexOf(terms[1]);
            console.log("CURRENT CODES: " + currentPlayer.codes);
            console.log("set player " + currentPlayerIndex + " selection to " + players[currentPlayerIndex].selection);
            if (currentPlayer.hasPlayed) {
                message.channel.send(`@${currentPlayer.tag} changed their choice! Is it a mistake... or is it a trick?!?`);
            } else {
                message.channel.send(`@${currentPlayer.tag} made their choice!`);
                players[currentPlayerIndex].hasPlayed = true;

                if (players[0].hasPlayed && players[1].hasPlayed) {
                    message.channel.send(getBattleStats());
                }
            }

            timeOfLastMove = message.createdTimestamp;

            break;
        default:
            message.channel.send(terms[0] + " is not a grass fire water command. See e!gfw for a list of commands.");
    }

}