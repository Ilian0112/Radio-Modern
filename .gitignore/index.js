const Discord = require("discord.js");

var bot = new Discord.Client();

var separation = "><><><><><><><><><><><";

bot.on("ready", () => {
    var connection_embed = new Discord.RichEmbed()
        .setTitle("Radio-Modern-1 - Je suis connecté")
        .setTimestamp()
        .setColor(embed_color)
    bot.channels.findAll("name", "logs-radio").map(channel => channel.send(connection_embed));
    autoplayradio();
});

function autoplayradio () {

    var channels_autoplayradio = ["482530580123222044", "480886933115895809", "467298506202152961"]
    //                           BAR                     Imaginarium          Universus

    autoplayradio_join();

    function autoplayradio_join () {
        var i;
        for (i = 0; i < channels_autoplayradio.length; i++) {
            var channels_autoplayradio_find = bot.channels.find("id", channels_autoplayradio[i]);
            channels_autoplayradio_find.join().then(connection => {
                require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
                    connection.playStream(res);
                })
            })
            console.log("-> autojoin\n    - Salon \"" + channels_autoplayradio_find.name + "\" (" + channels_autoplayradio_find.guild.name + ")\n" + separation)    
        }
        setTimeout(autoplayradio_leave, 15 * 60 * 1000)
    }

    function autoplayradio_leave () {
        var i;
        for (i = 0; i < channels_autoplayradio.length; i++) {
            var channels_autoplayradio_find = bot.channels.find("id", channels_autoplayradio[i]);
            channels_autoplayradio_find.leave();
            console.log("-> autojoin\n    + Salon \"" + channels_autoplayradio_find.name + "\" (" + channels_autoplayradio_find.guild.name + ")\n" + separation)
        }
        autoplayradio_join();
    }
}

bot.login(process.env.TOKEN);
