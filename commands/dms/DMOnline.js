const commando = require('discord.js-commando');
const app = require('../../app.js');
const config = require('../../config.json');
const Discord = require('discord.js');

class DMallCommand extends commando.Command {
    constructor(client){
        super(client, {
            name: `dmonline`,
            group: 'dms',
            memberName: 'dmonline',
            description: 'Sends message provided to all members of the guild with status .',
            examples: [ `${config.prefix}dmall Hey everyone! This might reach more people than a mass ping...` ]
        });
    }

    async run(message){
        let dmGuild = message.guild;
        let role = message.mentions.roles.first();
        let msg;
        let OnlineMembers;
        let interest;

        // First we use fetchMembers to make sure all members are cached
        message.guild.fetchMembers().then(fetchedGuild => {
            OnlineMembers = fetchedGuild.members.filter(member => member.presence.status === 'online');
        });

        message.reply('you now have *ten minutes* to send the message that you would like to massDM here.').then(() => {
            const filter = m => message.author.id === m.author.id;
        
            message.channel.awaitMessages(filter, { time: 6000, maxMatches: 1, errors: ['time'] })
                .then(messages => {
                    msg = messages.first().content;
                })
                .catch(() => {
                    message.reply('you did not enter any input!');
                });
        });

        

        message.reply(`type *"Y"* to begin sending the following message to **${OnlineMembers.length} members**, and *"N"* to forget it.\n\n${msg} \n #random`).then(() => {
            const filter = m => message.author.id === m.author.id;
        
            message.channel.awaitMessages(filter, { time: 6000, maxMatches: 1, errors: ['time'] })
                .then(messages => {
                    interest = messages.first().content;
                })
                .catch(() => {
                    message.reply('you did not enter any input!');
                });
        });
        if (messages.first().content != "N") {
            if(!msg || msg.length <= 1) {
                const embed = new Discord.RichEmbed()
                    .addField(":x: Failed to send", "Message not specified")
                    .addField(":eyes: Listen up!", "Uh Oh!");
                message.channel.send({ embed: embed });
                return;
            }
    
            let memberarray = dmGuild.members.array();
            let membercount = memberarray.length;
            let botcount = 0;
            let successcount = 0;
            console.log(`Responding to ${message.author.username} :  Sending message to all ${membercount} members of ${dmGuild.name}.`)
            for (var i = 0; i < membercount; i++) {
                let member = memberarray[i];
                if (member.user.bot) {
                    console.log(`Skipping bot with name ${member.user.username}`)
                    botcount++;
                    continue
                }
                let timeout = Math.floor((Math.random() * (config.wait - 0.01)) * 1000) + 10;
                await sleep(timeout);
                if(i == (membercount-1)) {
                    console.log(`Waited ${timeout}ms.\t\\/\tDMing ${member.user.username}`);
                } else {
                    console.log(`Waited ${timeout}ms.\t|${i + 1}|\tDMing ${member.user.username}`);
                }
                try {
                    member.send(`${msg} \n #${timeout}`);
                    successcount++;
                } catch (error) {
                    console.log(`Failed to send DM! ` + error)
                }
            }
            console.log(`Sent ${successcount} ${(successcount != 1 ? `messages` : `message`)} successfully, ` +
                `${botcount} ${(botcount != 1 ? `bots were` : `bot was`)} skipped.`);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = DMallCommand;