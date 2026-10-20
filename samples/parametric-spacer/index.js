// MIT — Copyright (c) 2026 Macadam contributors. See the repository LICENSE.
// A solid cylinder, not a hollow spacer: package API 1 has no boolean/subtract operation.
/** @param {import('../../types/local-plugin-api').LocalPluginHost} host */
function activate(host) {
  if (host.apiVersion !== '1') throw new Error('Parametric Spacer requires package API 1');
  host.registerFeature({
    id: 'spacer',
    name: 'Solid Spacer Blank',
    surface: 'solid',
    params: {
      radius: { kind: 'length', label: 'Outer radius', default: '6mm' },
      height: { kind: 'length', label: 'Height', default: '12mm' },
      x: { kind: 'length', label: 'Base X', default: '20mm' },
      y: { kind: 'length', label: 'Base Y', default: '0mm' },
      z: { kind: 'length', label: 'Base Z', default: '0mm' },
      tilt: { kind: 'angle', label: 'Tilt about Y', default: '0deg' },
    },
    template: { primitive: {
      kind: 'cylinder',
      dims: { radius: '${radius}', height: '${height}' },
      dx: '${x}', dy: '${y}', dz: '${z}',
      rx: '0deg', ry: '${tilt}', rz: '0deg',
      anchor: 'base',
    } },
  });
}
