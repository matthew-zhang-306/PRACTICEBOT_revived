/*
EIGHTBALL.JS
*/

// Intro blurb
const intro = {
    "embed": {
        "color": 1649238,
        "thumbnail": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/8-Ball_Pool.svg/2000px-8-Ball_Pool.svg.png"
        },
        "fields": [
            {
                "name": "e!8ball",
                "value": "Ask a yes or no question and the magic 8 ball will reveal the answer, but BE WARNED! Knowledge of one's fate seals it. Like, it becomes Kanon."
            },
            {
                "name": "Usage",
                "value": "e!8ball [question]"
            }
        ]
    }
}

// Responses
const responses = ["According to Wikipedia, yes.","So it seems.","Of course! <:CheerfulOsha:364561567104106498>",
    "YEAH BOI!","Def1n1tely.","Sure, whatever that means.","Uh, *obviously*.","Was that even a question?",
    "Yeah. I thought you asked this already.","About as certain as Miyolophone's next chips victory!",
    "...I didn't get that, what?","Dude, not now... please...","Ask me when I care, you fart.","Hmmmmm <:thonk:364561417497477120>",
    "I don't care, dude.","Well, what do *YOU* think the answer is?","Ehhhhhhhh probably not.",
    "Def1n1tely not.","Doesn't seem like it.","No. I thought you asked this already.","NAH BRUH.",
    "That wouldn't even make sense.","All the flatearthers say so. So no.","Nononononononono",
    "Ahhh, no, sorry. <:SadOsha:364561567032803328>","You can count on it not being that."];


// Logic
exports.manageGame = function(message, terms) {

    if (terms.length == 0) { // if no terms, send an introduction
        message.channel.send(intro);
    }
    else {
        let rand = Math.floor(Math.random() * responses.length);
        message.channel.send(responses[rand]);
    }

}