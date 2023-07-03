const Discord = require('discord.js');
const client = new Discord.Client({intents: 3276799});
const config = require('./config');
const { connect, mongoose } = require('mongoose');
const { ActivityType } = require('discord.js');
const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');
require('colors');
client.commands = new Discord.Collection();
client.buttons = new Discord.Collection();
client.selectMenus = new Discord.Collection();
client.modals = new Discord.Collection();
client
    .login(config.token)
    .then(() => {
        console.clear();
        console.log('[Discord API] '.green + client.user.username + ' foi logado com sucesso.');
        mongoose.set('strictQuery', true);
        connect(config.database, {
        }).then(() => {
        console.log('[MongoDB API] '.green + 'conectado com sucesso.')
        loadEvents(client);
        loadCommands(client);
        });
        })
    .catch((err) => console.log(err));

    const status = [
        {
          name: config.oneac,
          type: Discord.ActivityType.Listening,
          url: 'https://www.twitch.tv/discord',
      
        },
        {
          name: config.twoac,
          type: Discord.ActivityType.Streaming,
          url: 'https://www.twitch.tv/discord',
        },
        {
          name: config.threeac,
          type: Discord.ActivityType.Streaming,
          url: 'https://www.twitch.tv/discord',
      
        },
      
      ]
      
      client.on('ready', (c) => {
        console.clear();
        console.log(`✦ Prisma Studios </> - Online!`)
        console.log('𝔓𝔄𝔗𝔒 𝔇𝔘𝔖 𝔅𝔈ℭ𝔎');
      
        setInterval(() => {
          let random = Math.floor(Math.random() * status.length);
          client.user.setActivity(status[random]);
        }, 5000);
        client.user.setStatus('idle');
      });
    
//const mg = require('mongoose');
//
 //    mg.connect('mongodb+srv://patodusbeck:Manu2019@cluster0.7hnyin0.mongodb.net/?retryWrites=true&w=majority', {

//
  //   }).then(()  => console.log('Database Online com sucesso.'));