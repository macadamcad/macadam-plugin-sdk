// STAGING PREVIEW: an editable four-sided plate, one document Undo entry.
// No hole is created. This example received source review only.
function activate(host) {
  host.registerCommand({
    id: 'plate', name: 'Author a square plate (preview)',
    run(context) {
      const names = ['examplePlateRadius', 'examplePlateDepth'];
      const parameters = context.document && context.document.parameters;
      if (!parameters) return { type: 'message', text: 'This example requires document:read.' };
      if (parameters.some(p => names.includes(p.name))) {
        return { type: 'message', text: 'Example plate parameters already exist. Use a new document or Undo the previous plate.' };
      }
      return { type: 'author', program: {
        version: '1', label: 'Create square plate', steps: [
          { op: 'parameter', name: 'examplePlateRadius', kind: 'length', value: 0.01 },
          { op: 'parameter', name: 'examplePlateDepth', kind: 'length', value: 0.02 },
          { op: 'sketch', key: 'outline', name: 'Plate Outline', plane: 'xy' },
          { op: 'feature', key: 'polygon', name: 'Editable Square', command: 'sketch.polygon',
            path: ['outline'], fields: {
              'spec.kind.ngon.sides': '4', 'spec.kind.ngon.radius': 'examplePlateRadius',
            } },
          { op: 'feature', key: 'solid', name: 'Plate', command: 'solid.extrude', fields: {
            sketchFeatureID: { $feature: 'outline' }, depth: 'examplePlateDepth',
          } },
        ],
      } };
    },
  });
}
module.exports = { activate };
