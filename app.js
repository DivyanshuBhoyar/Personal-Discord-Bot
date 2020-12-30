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




client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('KurtaPyjama Kala\n Kala Kala Kala')
});

 

client.on('message', message => {
    if (message.author.bot) return ;
    if (message.content.startsWith(PREFIX)) { //starts with server prefix
 
        const [CMD_NAME , ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);
        console.log(CMD_NAME) ;
        console.log(args);

        

        if (CMD_NAME == cmds.CMDs.CALL){
            message.channel.send( `@everyone , here's a shoutout from ${message.author}.
            Come soon to ${message.channel}` )
            message.guild.members.cache.forEach(member => {
            if (member.id != message.author.id && !member.user.bot) member.send(`Show up soon in #${message.channel}`);
        })
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
            message.channel.send("Announcement made. Visit \#783028912220274698 ")
            const text = args.join(" ");
            client.channels.cache.get(`${DATA.aID}`).send(`📢  **${text}.**  -by:${message.author} `)
			
})
        return;}



        if (CMD_NAME == cmds.CMDs.gaali) {
        const text = args.join(" ");
        const gli = new Gaali({
            name : `${text}`
        })
        gli.save().then(message.channel.send("😂😂 Added to the collection. Use whole-heartedly 🙃")).catch((e)=> console.log(e))
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
                        u.send(`You are being called at ${message.channel}`).catch((e)=> console.log(e))
                    }) ;

                    if(v==='k') {
                    setTimeout(()=>{                 
                        const kuser = client.users.fetch("699137550756872254").then((user)=>{
                            if(user.presence.status === "offline"){
                                message.channel.send("Aye ***riya ke chamche***  Bahar nikal")
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
