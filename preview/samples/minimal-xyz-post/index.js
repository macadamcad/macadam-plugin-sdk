const post = require('./post.js');

/** @param {import('../../types/postprocessor-api').PostprocessorHost} host */
function activate(host) {
  host.registerPostProcessor(post);
}
