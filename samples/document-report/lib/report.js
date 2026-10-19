const { countByKind } = require('./format/counts.js');

module.exports.documentReport = function documentReport(document) {
  const unresolved = document.parameters.filter(parameter => parameter.resolved === false);
  return {
    type: 'message',
    text: `${document.features.length} timeline features\n${countByKind(document.features)}\n\n${document.parameters.length} named parameters; ${unresolved.length} unresolved.`,
  };
};
