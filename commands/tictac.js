/*
TIC TAC TOE
*/

// Intro blurb
const listOfCommands =
    "e!tictac new: starts a new game with you as X\n" +
    "e!tictac play [x] [y]: plays your letter in a certain row and column (and if you are O, you join the game)\n";
const intro = {
    "embed": {
        "color": 16739179,
        "fields": [
            {
                "name": "e!tictac",
                "value": "Or noughts and crosses, if you live in Britain or some other places probably"
            },
            {
                "name": "Commands",
                "value": listOfCommands
            }
        ]
    }
}

// Game things
const emptyBoard = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
];
var board;

const BoardState = {PLAY: -1, WIN: 0, DRAW: 1};
const GameState = {PRE: 0, PLAY: 1};
const letters = ["X", "O"];
var gameState = GameState.PRE;
var players = [null, null];
var turn = 0;

const timeoutTime = 60000;
var timeOfLastMove = 0;


// Logic
let checkIfValidPlay = function(message, terms) {
    if (gameState == GameState.PRE) { // check if game is playing
        message.channel.send("A game is not currently in progress. Use `e!tictac new` to start a new game.");
        return false;
    }
    if (terms.length != 3) { // check if there are exactly 3 terms
        message.channel.send("Usage: e!tictac play [row] [column]");
        return false;
    }

    var temp = parseInt(terms[1]);
    terms[1] = parseInt(terms[2]);
    terms[2] = temp;

    if (players[1] == null && message.author.tag != players[0]) { // add player 2 if they are joining
        message.channel.send(`@${message.author.tag} has been added as Player O.`);
        players[1] = message.author.tag;
    }
    if (!players.includes(message.author.tag)) { // check if they are in the game
        console.log(players);
        console.log(message.author.tag);
        message.channel.send("You are not in the current game. Wait for the game to end and then type `e!tictac new`");
        return false;
    }
    if (players.indexOf(message.author.tag) != turn) { // check if a player is playing out of turn
        message.channel.send("It is not your turn.");
        return false;
    }
    if (!Number.isInteger(terms[2]) || !Number.isInteger(terms[1])) { // check if inputs are valid
        message.channel.send("Usage: e!tictac play [x] [y]");
        return false;
    }
    if (terms[2] > 3 || terms[1] > 3 || terms[2] <= 0 || terms[1] <= 0) { // check if numeric inputs are in the range
        message.channel.send("There are 3 rows and columns in a tic tac toe board, dude.");
        return false;
    }
    if (board[terms[1]-1][terms[2]-1] != " ") { // check if the space is occupied
        message.channel.send("That space has already been played.")
        return false;
    }
    
    return true;
}

let checkBoardState = function(row, col) {
    var b = BoardState.PLAY;
    // row
    for (var c = 0; c < 3; c++) {
        if (board[row][c] != letters[turn])
            break;
        if (c == 2)
            b = BoardState.WIN;
    }
    // column
    for (var r = 0; r < 3; r++) {
        if (board[r][col] != letters[turn])
            break;
        if (r == 2)
            b = BoardState.WIN;
    }
    // diag
    if (row == col)
        for (var i = 0; i < 3; i++) {
            if (board[i][i] != letters[turn])
                break;
            if (i == 2)
                b = BoardState.WIN;
        }
    if (row == col - 2)
        for (var i = 0; i < 3; i++) {
            if (board[i][2-i] != letters[turn])
                break;
            if (i == 2)
                b = BoardState.WIN;
        }
    
    // draw check
    if (b == BoardState.PLAY) {
        outer: for (var r = 0; r < 3; r++)
            for (var c = 0; c < 3; c++) {
                if (board[r][c] == " ")
                    break outer;
                if (r == 2 && c == 2)
                    b = BoardState.DRAW;
            }
    }
    
    return b;
}

let printBoard = function() {
    var output =
        "```\n" +
        "   1   2   3\n" +
        "            \n" +
        "1  00 | 01 | 02\n" +
        "   ---------\n" +
        "2  10 | 11 | 12\n" +
        "   ---------\n" +
        "3  20 | 21 | 22```";
    for (var r = 0; r < 3; r++)
        for (var c = 0; c < 3; c++)
            output = output.replace(r+""+c, board[r][c]);
    return output;
}

let resetBoard = function() {
    var newBoard = [];
    for (var i = 0; i < 3; i++) {
        newBoard[i] = emptyBoard[i].slice(0);
    }
    return newBoard;
}

exports.manageGame = function(message, terms) {
    
    if (terms.length == 0) { // if no terms, send an introduction
        message.channel.send(intro);
    }
    else switch (terms[0]) {
        case "new":
            if (gameState == GameState.PLAY && message.createdTimestamp - timeOfLastMove < timeoutTime) {
                var timeLeft = (timeoutTime - (message.createdTimestamp - timeOfLastMove)) / 1000;
                message.channel.send(`Game in progress. Timeout in ${timeLeft} seconds`);
            }
            else {
                board = resetBoard();
                players[0] = message.author.tag;
                players[1] = null;
                gameState = GameState.PLAY;
                turn = 0;
                message.channel.send("Tic tac toe game started with @" + message.author.tag);
                message.channel.send(printBoard());

                timeOfLastMove = message.createdTimestamp;
            }
            
            break;
        case "play":
            if (!checkIfValidPlay(message, terms)) break;

            board[terms[1] - 1][terms[2] - 1] = letters[turn];
            var boardState = checkBoardState(terms[1] - 1, terms[2] - 1);

            if (boardState == BoardState.PLAY) {
                turn = (turn + 1) % 2;
            }
            else if (boardState == BoardState.WIN) {
                gameState = GameState.PRE;
                message.channel.send("@" + players[turn] + " won!");
            }
            else if (boardState == BoardState.DRAW) {
                gameState = GameState.PRE;
                message.channel.send("It's a tie.");
            }

            message.channel.send(printBoard());

            timeOfLastMove = message.createdTimestamp;

            break;
        default:
            message.channel.send(terms[0] + " is not a tic tac toe command. See e!tictac for a list of commands.");
    }

}