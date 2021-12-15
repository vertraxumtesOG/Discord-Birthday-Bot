//by vertraxumtes
//DONT REMOVE CREDITS
const Discord = require('discord.js');
const fs = require('fs')
const moment = require('moment')

//Config
const config = JSON.parse(fs.readFileSync(`./config.json` , 'utf-8'))
//Starting log
console.log('[STARTING] Bot is starting...')

const client = new Discord.Client()

async function nextday(){
    const day = new Date().getDate()
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    const guild = client.guilds.cache.get(config.guild);
    guild.members.cache.forEach(async member => {
        await member.roles.remove(config.bdayrole);
      });
    fs.readdirSync('./db/bdays').forEach(async (file) => {
        const user = JSON.parse(fs.readFileSync(`./db/bdays/${file}` , 'utf-8'))
        const userId = file.replace('.json', '')
        if(day == user.day && month == user.month){
            const bdayEmbed = new Discord.MessageEmbed()
                .setTitle(`New Birthday!`)
                .setColor('BLUE')
                .setDescription(`<@${userId}> has today Birthday he is now \`${year - user.year} Years old!\` Wish him all the best!`)
            const channel = client.channels.cache.get(config.bdaychannel);
            channel.send(bdayEmbed)
            const bdayuser = await guild.members.fetch(userId)
            bdayuser.roles.add(config.bdayrole)
        }
    })
}
//Ready
client.on('ready' , async() =>{
    console.log('[ONLINE] Bot is online! by vertraxumtes')
//Status
    client.user.setActivity('by vertraxumtes || Birthdays', {type: 'WATCHING'})
    setInterval(async () => {

		currhour = new Date().getHours()
		currmin = new Date().getMinutes()
		currday = new Date().getDate()

		if(currmin == 0){
			if(currhour == 0 || currhour == 24){
				nextday();
			}
		}
    })
})
//Test Command
client.on('message',async message=> {
    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if(message.content === '!bday trigger'){
        if(!message.member.hasPermission('ADMINISTRATOR')) return
        nextday()
    }
//Set your Birthday
    if(command === 'bday'){
        if(args[0] === 'set'){
            if(!args[1]){
                const errorEmbed = new Discord.MessageEmbed()
                    .setTitle(`» Birthdays`)
                    .setColor('DARK_RED')
                    .setDescription('Please enter your date of Birth in the following format:\n`Month/Day/Year`')
                message.channel.send(errorEmbed)
            }
            else{
                const bday = Date.parse(args[1]);
                if(isNaN(bday)){
                    const errorEmbed = new Discord.MessageEmbed()
                        .setTitle(`» Birthdays`)
                        .setColor('DARK_RED')
                        .setDescription('An error occurred while specifying your Birthday!\nPlease enter your date of birth in the following format:\n`Month/Day/Year`')
                    return message.channel.send(errorEmbed)
                }
                const date = new Date(bday)
                const month = date.toLocaleString("de-DE", {day: "numeric"})
                const day = date.toLocaleString("de-DE", {month: "numeric"})
                const year = date.toLocaleString("de-DE", {year: "numeric"})
                await fs.writeFileSync(`./db/bdays/${message.member.id}.json`, `{"month" : "${day}", "day" : "${month}", "year" : "${year}"}`);
                const successEmbed = new Discord.MessageEmbed()
                    .setTitle(`» Birthdays`)
                    .setColor('BLUE')
                    .setDescription(`You have successfully set your birthday to ${month}.${day}.${year}!`)
                message.channel.send(successEmbed)
            }
        }//Birthday List 
        else if(args[0] === 'list'){
            const bdaylist = []
            fs.readdirSync('./db/bdays').forEach((file) => {
                const user = JSON.parse(fs.readFileSync(`./db/bdays/${file}`, 'utf-8'),)
                const userId = file.replace('.json', '')
                today = new Date();

                var bday = moment([today.getFullYear(), user.month, user.day]);
                var daysleft = bday.diff(today, 'days')
                if(daysleft <= -1){
                    var bday = moment([today.getFullYear() + 1, user.month, user.day]);
                    daysleft = bday.diff(today, 'days')
                }
                bdaylist.push({ id: userId, left: daysleft })
              });
              const bdaylistorder = bdaylist.sort((a, b) => a.left - b.left).slice(0, 10)
              var nextbdays = ""
              bdaylistorder.forEach(entry => {
                  nextbdays = nextbdays + `\n<@${entry.id}> - in ${entry.left} Days`
              });
              const successEmbed = new Discord.MessageEmbed()
                .setTitle(`__**Next Birthdays »**__`)
                .setColor('BLUE')
                .setDescription(nextbdays)
            message.channel.send(successEmbed)

        }
        else if (args[0] === 'set' && args[0] === 'list'){
            const errorEmbed = new Discord.MessageEmbed()
                    .setTitle(`» Birthdays`)
                    .setColor('DARK_RED')
                    .setDescription('Use this Format `bday set <Date>` or `bday list`!')
                message.channel.send(errorEmbed)
                
        }
    }
})
//Login
client.login(config.token)

//by vertraxumtes
//DONT REMOVE CREDITS