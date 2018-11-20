const Discord = require("discord.js");

var bot = new Discord.Client();

var separation = "><><><><><><><><><><><";

var prefix = ".";

var channels_autoradio = ["442651081080569867", "499601814656909321", "480886933115895809"];
//                        Le QZ                 Omega                 Imaginarium

bot.on("ready", () => {
    var embed = new Discord.RichEmbed()
        .setTitle("RM1 - Je suis connecté")
        .setTimestamp()
    bot.channels.findAll("name", "logs-radio").map(c => c.send(embed));
    console.log(separation + "\nBot prêt\n" + separation);
    autoradio_join();
});

bot.on("message", (message) => {
    if (message.author.id === "323039726040776705" || message.author.id === "182977157314772993") {
        if (!message.content.startsWith(prefix)) return;
        var splited = message.content.substring(prefix.length).split(" ");
        var command = splited[0];
        switch (command.toLowerCase()) {
            case "autoradio":
                message.delete();
                console.log("-> " + prefix + "autoradio\n" + separation);
                autoradio_leave();
                break;
        }
    }
});

function autoradio_join () {
    for (var i = 0; i < channels_autoradio.length; i++) {
        var channels_autoradio_find = bot.channels.find("id", channels_autoradio[i]);
        channels_autoradio_find.join().then(connection => {
            require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                connection.playStream(res)
            })
        })
        console.log("-> autoradio (join)\n    - Salon \"" + channels_autoradio_find.name + "\" (" + channels_autoradio_find.guild.name + ")\n" + separation);
    }
    setTimeout(autoradio_leave, 20 * 60 * 1000);
}

function autoradio_leave () {
    for (var i = 0; i < channels_autoradio.length; i++) {
        var channels_autoradio_find = bot.channels.find("id", channels_autoradio[i]);
        channels_autoradio_find.leave();
        console.log("-> autoradio (leave)\n    + Salon \"" + channels_autoradio_find.name + "\" (" + channels_autoradio_find.guild.name + ")\n" + separation);
    }
    autoradio_join();
}

bot.login(process.env.TOKEN);
