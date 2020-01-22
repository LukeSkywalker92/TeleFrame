var i18n = {
  // Language display name
  name: 'Français',

  // welcome reply to '/start'
  welcome: 'Bonjour',

  // reply to /help
  help: 'Envoyez moi une image ou une vidéo.\nJe supporte les formats jpg, png, gif ou mp4',

  // info missing whitelist entry
  whitelistInfo: 'Désolé, ce bot est restreint à une liste autorisée. Merci d\'ajouter l\`identifiant de cette conversation à la liste dans le fichier de configuration',

  // info missing admin whitelist entry
  whitelistAdminInfo: 'Désolé, les actions administrateurs de ce bot sont restreintes à une liste autorisée. Merci d\'ajouter l\'identifiant de cette conversation à la liste dans le fichier de configuration',

  // reply to 'hi' requires additional parameters - use a function
  hiReply: (name, chatId) => `Bonjour ${name} !\nL'identifiant de cette conversation est ${chatId}`,

  // The error message if the received document has unknown format
  documentFormatError: 'Ce document est dans un format inconnu.',

  // Admin action triggered
  adminActionTriggered: (actionName) => `Action lancée '${actionName}'`,

  // Admin action triggered execution error
  adminActionError: (actionName, errorCode, stderr) => `'${actionName}' ERREUR\n\nCode d'erreur: ${errorCode}\nStdErr: ${stderr}`,

  // Admin action triggered execution success
  adminActionSuccess: (actionName, stdout) => `'${actionName}' SUCCES\n\n${stdout}`

  // video received
  videoReceived: '\u{1F44D}\u{1F3A5}',

  // image received
  imageReceived: '\u{1F44D}\u{1F4F8}',

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = i18n;
}
