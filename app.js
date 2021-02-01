require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(`mongodb://hatwaarbeta:${process.env.DB_PASSWORD}@devcluster0-shard-00-00.hdvnq.mongodb.net:27017,devcluster0-shard-00-01.hdvnq.mongodb.net:27017,devcluster0-shard-00-02.hdvnq.mongodb.net:27017/senate-data?ssl=true&replicaSet=atlas-rsjh27-shard-0&authSource=admin&retryWrites=true&w=majority` , {useNewUrlParser: true, useUnifiedTopology: true}) ;
mongoose.set('useFindAndModify', false);

//connect to db before test run
mongoose.connection.once("open" , function(){
    console.log("Connected.");
}).on('error', function(error) {
    console.log("connection erorr ", error);
})

const LanguageToolApi = require('language-grammar-api');
const options = {
  endpoint: 'https://languagetool.org/api/v2'
};
const languageToolClient = new LanguageToolApi(options);


var cmds = require("./Cmd")
// require
const moment = require('moment-timezone') ;
const DATA = require("./data") ;
const Memory = require('./memories')   //import collection model
const Gaali = require('./gmodel') ;


const Discord = require('discord.js');
const client = new Discord.Client();
const PREFIX = "."

let schedule = require('node-schedule');
const { default: axios } = require('axios');
let rule = new schedule.RecurrenceRule();
// your timezone
rule.tz = 'Asia/Kolkata';
// runs at 15:00:00
rule.second = 00;
rule.minute = 00;
rule.hour = 08;
// schedule
schedule.scheduleJob(rule, async function () {
  console.log('Hello World!');
  try {
      const {data} = await axios.get('https://zenquotes.io/api/today')
      console.log(data[0].q);
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#f5ed00')
        .setTitle(data[0].q)	
        .setTimestamp()
        .setFooter('Thought of the day');
        client.channels.fetch('792301782507585539')
        .then((channel) => {
            channel.send(exampleEmbed)});
  } catch (error) {
      console.log(error)
  }

});




client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('Under Maintainance')

//   if(hoursIST === 23 && monthIST === 11 && dateIST===31 && minutesIST===59) {
//   var i = 60 ;

//     var countdownTimer = setInterval(function() {
//     client.channels.cache.get(`764068934953336833`).send(`${i}`) ;
//     i = i - 1;
//     if (i <= 0) {
//       client.channels.cache.get(`764068934953336833`).send("🎊🎆🎇🎊🎆🎇\n **WELCOME 2021**\n🥳🥂🙌🥳🥂🙌" ,{files: ["https://indianexpress.com/wp-content/uploads/2020/12/AUSTRALIA-1.jpg"]}) ;

//         clearInterval(countdownTimer);

//     }
// }, 1000);

//   }
});




client.on('message', message => {
    if (message.author.bot) return ;
    if (message.content.startsWith(PREFIX)) { //starts with server prefix

        const [CMD_NAME , ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);
        console.log(CMD_NAME) ;
       
        console.log(args);
        

     if(CMD_NAME === "ping"){
        message.channel.send(`🚀 Latency  ${Date.now() - message.createdTimestamp}ms. 📡 API Latency is ${Math.round(client.ws.ping)}ms`);
        return
     }

        if (CMD_NAME == cmds.CMDs.CALL){
            message.channel.send( `@everyone , here's a shoutout from ${message.author}.
            Come soon to ${message.channel}` )
            message.guild.members.cache.forEach(member => {
            if (member.id != message.author.id && !member.user.bot) member.send(`Show up soon in #${message.channel}`);
        })
        return ;
        }

            if (CMD_NAME == cmds.CMDs.weather){
            message.channel.send("http://www.7timer.info/bin/astro.php?lon=21.14&lat=79.08&ac=0&lang=en&unit=metric&output=internal&tzshift=0")
        return ;
        }


        if (CMD_NAME == cmds.CMDs.joke){
           
                const res =  axios.get("https://v2.jokeapi.dev/joke/Programming,Dark?type=single").then( (data) => {
                   
                    message.channel.send( data.data.joke)
                }
                ).catch((e)=> {console.log(e)})
            

        return ;
        }
                if (CMD_NAME == cmds.CMDs.insult){
                    
                    if(args[0]) {
                    const res =  axios.get("https://evilinsult.com/generate_insult.php?lang=en&type=json").then( (data) => {
                                        
                            
                    message.channel.send( `${data.data.insult} ${args[0]}`)
                }
                ).catch((e)=> {console.log(e)})
            }else message.reply("Need a target")

        return ;
        }



        if (CMD_NAME == cmds.CMDs.date){

        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Currently, its')
        .addFields(
            { name: 'UTC/GMT', value: `**${moment.utc().format('YYYY-MM-DD [\n] HH:mm')}**`, inline: true },
            { name: 'PST/PDT', value: `**${moment.utc().tz('America/Los_Angeles').format('YYYY-MM-DD [\n] HH:mm')}**`, inline: true },
            { name: 'EST/EDT', value: `**${moment.utc().tz('America/New_York').format('YYYY-MM-DD [\n] HH:mm')}**`, inline: true },
        )
        message.channel.send(exampleEmbed);
        return;
        }



        if (CMD_NAME == cmds.CMDs.memory){
                const text = args.join(" ");
                var mem = new Memory({                          //same as creating a new js object
                title : `${text}` ,
                date : `${message.createdAt}`,

            }) ;
            mem.save()
            .then(message.channel.send("Added to the Memories collection 😉"))
        return;}



        var data = [] ;
        if(CMD_NAME == cmds.CMDs.memoryList) {
            Memory.find({}).then((result)=>{
                //console.log(result)
            result.forEach((doc)=>{data.push(doc.title)} )
            message.channel.send(`**${(data.join("\n"))}** `)
            }).catch((e)=> {
                console.log(e);
            }) ;
            ;
       return; }



        var gdata =[]
        if(CMD_NAME == cmds.CMDs.galiList) {
            Gaali.find({}).then((result)=>{
                // console.log(result)
                result.forEach((doc)=>{gdata.push(doc.name)} )
                message.channel.send(`All socially accepted good words: \n***${(gdata.join("\n"))}*** `)
                }).catch((e)=> {
                console.log(e);
                }) ;
            ;
        return;}




        if (CMD_NAME == cmds.CMDs.announce) {
            message.channel.send("Announcement made. Visit <\#783028912220274698> ")
            const text = args.join(" ");
            client.channels.cache.get(`${DATA.aID}`).send(`📢  **${text}.**  :${message.author} `)
	    client.channels.cache.get("752810283449450496").send('📢  Announcement made. Visit <\#783028912220274698> ')
	    client.channels.cache.get("783075974996426782").send('📢  Announcement made. Visit <\#783028912220274698> ')


        return;}



        if (CMD_NAME == cmds.CMDs.gaali) {
        const text = args.join(" ");
        const gli = new Gaali({
            name : `${text}`
        })
        gli.save().then(message.channel.send("☠ Added to the collection. Use whole-heartedly 🙃")).catch((e)=> console.log(e))
        return;}



        if(CMD_NAME == cmds.CMDs.grammar) {
            const text = args.join(" ");
            const check = languageToolClient.check({
            text: `${text}`, // required
            language: 'en-US' // required (you can use .languages call to get language)
            }).then((check)=>{

 //               console.log(check.language.code);
   //             console.log(check.matches[1].message);
     //           console.log(check.matches[1].shortMessage);
                var repl0 = []
				var msg = []
				var smsg = []


				for (i=0 ; i < check.matches.length; i++) {

                check.matches[i].replacements.forEach((subset) => {
				repl0.push(subset.value) ; })
                msg.push(check.matches[i].message);
                if(check.matches[i].shortMessage !== ''){smsg.push(check.matches[i].shortMessage)};
				}

//				console.log(msg.length, smsg.length, repl0.length)
                if(msg.length === 0) {
				msg.push("-")}
                if(smsg.length === 0) {
				smsg.push("-")}
				if(repl0.length === 0) {
				repl0.push('-')}
                console.log(msg, smsg)
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Grammar Check')


                    .setDescription(`Detected language: ${check.language.code}.`)

                    .addFields(

                        { name: "Message" , value : `${msg}` },
                        { name: "Grammar issue", value :`${smsg}` },
		                {name: "Possible replacements", value : `${repl0} ` }
                    )


                    .setTimestamp()


                 message.channel.send(exampleEmbed);
            }
                ).catch((e)=>{console.log(e)});

        return;
    }




        if (CMD_NAME == cmds.CMDs.call){
            args.forEach((v) => {
                if(DATA.membersMap.has(v)) {
                    message.channel.send(`Calling <@${DATA.membersMap.get(v)}> `)
                    console.log(typeof(DATA.membersMap.get(v)));
                    const u = client.users.fetch(DATA.membersMap.get(v))
                    u.then((u) => {
                        u.send(`You are being called at ${message.channel} \n <@${DATA.membersMap.get(v)}>`).catch((e)=> console.log(e))
                    }) ;

                    if(v==='k') {
                        var response = DATA.kalass_lines[Math.floor(Math.random() * DATA.kalass_lines.length)] ;
                        console.log(response);
                        setTimeout(()=>{
                        const kuser = client.users.fetch(DATA.membersMap.get(v)).then((user)=>{
                            if(user.presence.status === "offline"){
                                message.channel.send(`${response} \n <@${DATA.membersMap.get(v)}>`)
                            };
                        }).catch((e)=>{console.log(e)})

                    }, 300000)
                }
                    if(v==='x') {
                        var response = DATA.x_lines[Math.floor(Math.random() * DATA.x_lines.length)] ;
                        console.log(response);
                        setTimeout(()=>{
                        const kuser = client.users.fetch(DATA.membersMap.get(v)).then((user)=>{
                            if(user.presence.status === "offline"){
                                message.channel.send(`${response} \n <@${DATA.membersMap.get(v)}>`)
                            };
                        }).catch((e)=>{console.log(e)})

                    }, 300000)
                }
                if(v==='a') {
                        var response = DATA.arjuna_lines[Math.floor(Math.random() * DATA.arjuna_lines.length)] ;
                        console.log(response);
                        setTimeout(()=>{
                        const kuser = client.users.fetch(DATA.membersMap.get(v)).then((user)=>{
                            if(user.presence.status === "offline"){
                                message.channel.send(`${response} \n <@${DATA.membersMap.get(v)}>`)
                            };
                        }).catch((e)=>{console.log(e)})

                    }, 300000)
                }
                if(v==='m') {
                        var response = DATA.molly_lines[Math.floor(Math.random() * DATA.molly_lines.length)] ;
                        console.log(response);
                        setTimeout(()=>{
                        const kuser = client.users.fetch(DATA.membersMap.get(v)).then((user)=>{
                            if(user.presence.status === "offline"){
                                message.channel.send(`${response} \n <@${DATA.membersMap.get(v)}>`)
                            };
                        }).catch((e)=>{console.log(e)})

                    }, 300000)
                }
                if(v==='d') {
                        var response = DATA.deepya_lines[Math.floor(Math.random() * DATA.deepya_lines.length)] ;
                        console.log(response);
                        setTimeout(()=>{
                        const kuser = client.users.fetch(DATA.membersMap.get(v)).then((user)=>{
                            if(user.presence.status === "offline"){
                                message.channel.send(`${response} \n <@${DATA.membersMap.get(v)}>`)
                            };
                        }).catch((e)=>{console.log(e)})

                    }, 300000)
                }
                if(v==='r') {
                        var response = DATA.rohan_lines[Math.floor(Math.random() * DATA.rohan_lines.length)] ;
                        console.log(response);
                        setTimeout(()=>{
                        const kuser = client.users.fetch(DATA.membersMap.get(v)).then((user)=>{
                            if(user.presence.status === "offline"){
                                message.channel.send(`${response} \n <@${DATA.membersMap.get(v)}>`)
                            };
                        }).catch((e)=>{console.log(e)})

                    }, 300000)
                }
                if(v==='g') {
                        var response = DATA.gunjan_lines[Math.floor(Math.random() * DATA.gunjan_lines.length)] ;
                        console.log(response);
                        setTimeout(()=>{
                        const kuser = client.users.fetch(DATA.membersMap.get(v)).then((user)=>{
                            if(user.presence.status === "offline"){
                                message.channel.send(`${response} \n <@${DATA.membersMap.get(v)}>`)
                            };
                        }).catch((e)=>{console.log(e)})

                    }, 300000)
                }
                if(v==='D') {
                        var response = DATA.divyanshu_lines[Math.floor(Math.random() * DATA.divyanshu_lines.length)] ;
                        console.log(response);
                        setTimeout(()=>{
                        const kuser = client.users.fetch(DATA.membersMap.get(v)).then((user)=>{
                            if(user.presence.status === "offline"){
                                message.channel.send(`${response} \n <@${DATA.membersMap.get(v)}>`)
                            };
                        }).catch((e)=>{console.log(e)})

                    }, 300000)
                }
                
                }

            })
        return;}



}

});



client.on("emojiCreate", function(emoji){
        client.channels.fetch('764068934953336833')
    .then((channel) => {
        const nemoji = channel.guild.emojis.cache.get(`${emoji.id}`);
        channel.send(`A new emoji was added: ${nemoji}`)});




return;
});


client.login(process.env.BOT_TOKEN);
console.log(cmds.CMDs);
