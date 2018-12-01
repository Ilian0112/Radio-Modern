const Discord = require("discord.js");

var bot = new Discord.Client();

var separation = "><><><><><><><><><><><";

var cooldown = new Set();

var channels_autoradio = ["442651081080569867", "499601814656909321", /*"482530580123222044", "480886933115895809"*/];
//                        Le QZ                 Omega                 BAR                   Imaginarium

bot.on("ready", () => {
    var embed = new Discord.RichEmbed()
        .setTitle("RM1 - Je suis connecté")
        .setTimestamp()
    bot.channels.findAll("name", "logs-radio").map(c => c.send(embed));
    console.log(separation + "\nBot prêt\n" + separation);
    autoradio_join();
    autoradio_test();
});

function autoradio_join () {
    for (var i = 0; i < channels_autoradio.length; i++) {
        var channels_autoradio_find = bot.channels.find("id", channels_autoradio[i]);
        channels_autoradio_find.join();
    }
}

function autoradio_test () {
    for (var i = 0; i < channels_autoradio.length; i++) {
        var channels_autoradio_find = bot.channels.find("id", channels_autoradio[i]);
        var channels_autoradio_find_members_array = channels_autoradio_find.members.array();
        if (channels_autoradio_find_members_array.length > 1) {
            autoradio_play(channels_autoradio[i]);
            setCooldown(channels_autoradio[i]);
        }
        if (channels_autoradio_find_members_array.length == 1) return autoradio_stop(channels_autoradio[i]);
    }
    setTimeout(autoradio_test, 10000)
}

function autoradio_play (id) {
    if (cooldown.has(id)) return;
    var channels_autoradio_find = bot.channels.find("id", id);
    channels_autoradio_find.join().then(connection => {
        require("http").get("http://streaming.radionomy.com/RadioModern", (res) => {
            connection.playStream(res)
        })
    })
}

function autoradio_stop (id) {
    var channels_autoradio_find = bot.channels.find("id", id);
    channels_autoradio_find.leave();
    channels_autoradio_find.join();
}

function setCooldown (id) {
    cooldown.add(id);
    setTimeout(() => {
        cooldown.delete(id);
    }, 5000);
}

bot.login(process.env.TOKEN);
