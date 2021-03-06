/*
 * Credit goes to @zwilias, from his PR here https://github.com/rtfeldman/node-test-runner/pull/356/files
 */

const spawnAsync = require('./spawn-async');

function get(pathToElmJson) {
  return spawnAsync(
    'npx',
    [
      'elm-json',
      'solve',
      '--extra',
      'elm/core',
      'elm/json',
      'stil4m/elm-syntax',
      'elm/project-metadata-utils',
      'jfmengels/elm-lint-reporter',
      '--',
      pathToElmJson
    ],
    {
      silent: true,
      env: process.env
    }
  )
    .then(JSON.parse)
    .catch(handleInternetAccessError);
}

function add(pathToElmJson) {
  return spawnAsync(
    'npx',
    ['elm-json', 'install', '--yes', 'jfmengels/elm-lint', '--', pathToElmJson],
    {
      silent: true,
      env: process.env
    }
  ).catch(handleInternetAccessError);
}

function handleInternetAccessError(error) {
  if (error && error.message && error.message.startsWith('phase: retrieve')) {
    return Promise.resolve(
      new Error(
        `I'm sorry, but it looks like you don't have access to the Internet at the moment.

I require access to the Internet for some of my inner workings.
Please connect to the Internet and try again.`
      )
    );
  }

  return Promise.resolve(error);
}

module.exports = {
  get,
  add
};
