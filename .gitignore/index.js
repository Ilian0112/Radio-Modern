const Discord = require("discord.js");

var bot = new Discord.Client();

var separation = "▬▬▬▬▬▬▬▬▬▬▬▬▬";

var prefix = process.env.prefix;

var infoRecently_Join = new Set();

bot.on("ready", () => {
    var embed = new Discord.RichEmbed()
        .setTitle("RM1 - I'm connected")
        .setTimestamp()
    bot.channels.array().filter(c => c.name === "logs-radiom").map(c => c.send(embed));
    console.log(separation + "\nBot ready\n" + separation);
    autoradio_join();
});

bot.on("message", (message) => {
    var bot_member = bot.guilds.get("504206997164654602").members.get(message.author.id);
    if (!bot_member.roles.has("538420571533475850")) return;
    if (!message.content.startsWith(prefix)) return;
    var splited = message.content.substring(prefix.length).split(" ");
    var args0 = splited[0];
    switch (args0.toLowerCase()) {
        case "autoradio":
            console.log("-> " + prefix + "autoradio\n" + separation);
            autoradio_leave();
            break;
    }
});

function autoradio_join () {
    var channels_autoradio_list = process.env.channels_autoradio.split(",");
    for (var i = 0; i < channels_autoradio_list.length; i++) {
        var channel_autoradio = bot.channels.find("id", channels_autoradio_list[i]);
        channel_autoradio.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res)
            })
        })
        console.log("+ Salon \"" + channel_autoradio.name + "\" (" + channel_autoradio.guild.name + ")\n" + separation);
    }
    setTimeout(autoradio_leave, 20 * 60 * 1000);
}

function autoradio_leave () {
    var channels_autoradio_list = process.env.channels_autoradio.split(",");
    for (var i = 0; i < channels_autoradio_list.length; i++) {
        var channel_autoradio = bot.channels.find("id", channels_autoradio_list[i]);
        channel_autoradio.leave();
        console.log("- Salon \"" + channel_autoradio.name + "\" (" + channel_autoradio.guild.name + ")\n" + separation);
    }
    autoradio_join();
}

bot.on("voiceStateUpdate", (oldMember, newMember) => {

    var infoJoin_embed = new Discord.RichEmbed()
        .setAuthor("Info", "https://cdn.discordapp.com/attachments/517737550618558466/534453800044462081/678110-sign-info-512.png")
        .setDescription("Fantastic !\nYou have just joined a channel dedicated to Radio Modern !\n\nIf there is any problem, come [here](http://discord.gg/4fDkbPw)\nThe Radio Modern is a radio broadcasting remix ! If you want to support us, add me to your server [here](http://discordapp.com/oauth2/authorize?&client_id=444951082750312468&scope=bot&permissions=37055552)\nType .help for more information about me !\nEnjoy !")
        .setColor("#2E9AFE")

    if (channels_autoradio.includes(newMember.voiceChannelID)) {
        if (infoRecently_Join.has(newMember.user.id) || oldMember.voiceChannelID === newMember.voiceChannelID) return;
        infoRecently_Join.add(newMember.user.id)
        newMember.send(infoJoin_embed)
    }
    
})

bot.login(process.env.token);
