module.exports.countByKind = function countByKind(features) {
  const counts = {};
  for (const feature of features) counts[feature.kind] = (counts[feature.kind] || 0) + 1;
  return Object.keys(counts).sort().map(kind => `${kind}: ${counts[kind]}`).join('\n');
};
