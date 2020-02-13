const langDefault = 'en';
const langPath =  __dirname + '/../config/i18n/bot/';
const botPhrases = {};

botPhrases[langDefault] = require(langPath + langDefault);

/**
 * Replies using the phrase for the sender's language
 * @param  {Object} ctx      telegraf request
 * @param  {string} constant The constant to use
 * @param  {array} args     [optional] Additional arguments to pass when the constant returns a function
 */
const botReply = (ctx, constant, ...args) => {
  const langSender = ctx.from.language_code.substr(0, 2).toLowerCase();
  if (!botPhrases[langSender]) {
    try {
      botPhrases[langSender] = Object.assign({}, botPhrases[langDefault], require(langPath + langSender));
    } catch (e) {
      // language file does'nt exist. Reference default language
      botPhrases[langSender] = botPhrases[langDefault];
    }
  }
  // Whenthe phrase is a function, it is called and the additional arguments are passed
  if (typeof botPhrases[langSender][constant] === 'function') {
    ctx.reply(botPhrases[langSender][constant](...args));
  } else {
    ctx.reply(botPhrases[langSender][constant]);
  }
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = botReply;
}
