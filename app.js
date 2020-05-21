/*jshint esversion: 6 */

const Discord = require('discord.js');
const figlet = require('figlet');
const colors = require('colors');
const readline = require('readline');
const commando = require(`discord.js-commando`);

const config = require('./config.json');
const bot = new commando.Client({
    commandPrefix:'mass!',
    owner: config.id
});

const cmdsArray = [
    "dmall <message>",
    "dmrole <role> <message>"
];

bot.on("ready", () => {
    clear();
    console.log('______');
    bot.user.setActivity('from GitHub', { url: "https://github.com/alexlyee/massdm", type: 'PLAYING' })
        .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
        .catch(console.error);
    
});


bot.on("error", (error) => {
    bot.login(config.token);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

bot.registry.registerGroup('dms', 'help');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

if (process.env.BOT_TOKEN) bot.login(process.env.BOT_TOKEN);
else bot.login(config.token);




function clear() {
    console.clear();
    console.log(figlet.textSync("MassDM v3.4.0f").green); // final, fixed [but not really], etc..?
    console.log("\n\nMass DM bot for Discord. \n Sends DMs to selected members of guild.\n  Forked and improved by Alex.");
    console.log("\n     Don't forget to apply the proper permissions in Discord. Use https://github.com/alexlyee/massdm/issues to report issues. Suport server: https://discord.gg/mMWQaDx");
    console.log("\n     After someone by the name of \"6669\" double-crossed me, \n(assuring me that I would be paid for working on the project, but once I did most of the work and proved it was fixed, blocked me) \n    I will be abandoning this project, please do not contact me to report bugs. I am aware that there are some. ");
    console.log(`\nRandom send time set @ 0.01-${config.wait}s`);
    console.log(` Type  ${config.prefix}help  in a chat.\n\n`);
}


/*
The only values that are not truthy in JavaScript are the following (a.k.a. falsy values):

null
undefined
0
"" (the empty string)
false
NaN
*/