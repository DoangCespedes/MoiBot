const { Telegraf } = require('telegraf');
const fs = require('fs');
const axios = require('axios');

const bot = new Telegraf('5501782151:AAH5YOowM7E0wF5wdCwLCwPx_BTCGFxLPjc');

const helpMessage = `You can control me by sending these commands:\n /start-Arrancamos el Bot \n /help-Info del Bot\n /send-El bot nos envia una img\n
Tmabien puede almacenar una img tan solo enviandola al chat y se guardara en el servidor\n` ;

const  downloadImage = (url, image_path, ctx) => {
   axios({url, responseType: 'stream'}).then(
      (response) => 
         new Promise((resolve, reject) =>{
            response.data 
               .pipe(fs.createWriteStream(image_path))
               .on('finish', () => {
                  ctx.reply('Almacenada correctamente');
                  resolve();
               })
               .on('error', (e) =>{
                  ctx.reply('No se puede almacenar correctamente');
                  reject(e);
               });
         }))
}

bot.help((ctx) => ctx.reply(helpMessage));

bot.start((ctx)=>{
   ctx.reply('Hi my name is MoiBot. Welcome ' + ctx.from.first_name + ' ' + ctx.from.last_name);
   // console.log(ctx.from);
})
 
//  Cuando persiva alguna accion 

bot.on('text', (ctx) => ctx.reply('this is a Text'));

bot.on('sticker', (ctx) => ctx.reply('👍'));
 
// Cuando reciba una imagen 
bot.on('photo', (ctx) => {
   const fileId = ctx.update.message.photo[3].file_id

   ctx.telegram.getFileLink(fileId).then((response) => {
      downloadImage(response.href, './photo.jpg' ,ctx)
   })
   ctx.reply('this is a photo');
})
 //Cuando persiva una palabra en especifico
 bot.hears('hi', (ctx) => ctx.reply('Hey there'));

 //Para enviar elementos (fotos, voice, documents, etc...)
 bot.command('send', async(ctx)=>{
  await ctx.sendPhoto({source: "photo.jpg"});
 });

 bot.on('hipster', Telegraf.reply('λ'));
 bot.launch();