const SlackBot = new require('slackbots');
const Modulus = require('./modulus')(process.env.MODULUS_TOKEN);

var bot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: 'ModulusBot'
});

function formatProject(project) {
  return project.name + ' ('+ project.id + ') :\t' + project.status;
}

function listProjects() {
  Modulus.listProjects(process.env.MODULUS_USER, function (err, projects) {
    var out = '';

    if (err) return bot.postMessageToChannel(process.env.SLACK_CHANNEL, 'Failed to list projects :(');

    projects.forEach(function (project) {
      out += formatProject(project) + '\n';
    });

    bot.postMessageToChannel(process.env.SLACK_CHANNEL, out);
  });
}

function restartProject(id) {
  if (!id) return bot.postMessageToChannel(process.env.SLACK_CHANNEL, 'Hey, I need a project ID');

  Modulus.restartProject(id, function (err) {
    if (err) return bot.postMessageToChannel(process.env.SLACK_CHANNEL, 'Something went wrong..');
    bot.postMessageToChannel(process.env.SLACK_CHANNEL, 'Alright, restarting project ' + id);
  });
}

function handleMessage(message) {
  if (message.text.indexOf('modulus project list') >= 0) {
    return listProjects();
  }

  if (message.text.indexOf('modulus project restart') >= 0) {
    return restartProject(message.text.split(' ')[3]);
  }
}

bot.on('message', function (message) {
  if (message.text && message.text.indexOf('modulus') >= 0) {
    handleMessage(message);
  }
});
