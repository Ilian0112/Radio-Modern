const Discord = require("discord.js");

var bot = new Discord.Client();

var separation = "▬▬▬▬▬▬▬▬▬▬▬▬▬";

var channels_autoradio = ["442651081080569867", "499601814656909321", "536120724536950784"];
//                        Le QZ                 Omega                 Imaginarium V2

bot.on("ready", () => {
    var embed = new Discord.RichEmbed()
        .setTitle("RM1 - I'm connected")
        .setTimestamp()
    bot.channels.findAll("name", "logs-radiom").map(c => c.send(embed));
    console.log(separation + "\nBot ready\n" + separation);
    autoradio_join();
});

function autoradio_join () {
    for (var i = 0; i < channels_autoradio.length; i++) {
        var channels_autoradio_find = bot.channels.find("id", channels_autoradio[i]);
        channels_autoradio_find.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res)
            })
        })
        console.log("-> autoradio (join)\n    + Salon \"" + channels_autoradio_find.name + "\" (" + channels_autoradio_find.guild.name + ")\n" + separation);
    }
    setTimeout(autoradio_leave, 20 * 60 * 1000);
}

function autoradio_leave () {
    for (var i = 0; i < channels_autoradio.length; i++) {
        var channels_autoradio_find = bot.channels.find("id", channels_autoradio[i]);
        channels_autoradio_find.leave();
        console.log("-> autoradio (leave)\n    - Salon \"" + channels_autoradio_find.name + "\" (" + channels_autoradio_find.guild.name + ")\n" + separation);
    }
    autoradio_join();
}

bot.login(process.env.TOKEN);
