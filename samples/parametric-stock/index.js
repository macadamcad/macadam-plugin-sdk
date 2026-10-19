function activate(host) {
  host.registerFeature({
    id: 'stock', name: 'Oversize Stock', surface: 'solid',
    params: {
      width: { kind: 'length', label: 'Finished width', default: '100mm' },
      depth: { kind: 'length', label: 'Finished depth', default: '60mm' },
      thickness: { kind: 'length', label: 'Finished thickness', default: '18mm' },
      allowance: { kind: 'length', label: 'Allowance per side', default: '2mm' },
    },
    template: { primitive: {
      kind: 'box',
      dims: { width: '${width} + 2 * ${allowance}', depth: '${depth} + 2 * ${allowance}', height: '${thickness} + 2 * ${allowance}' },
      dx: '0', dy: '0', dz: '0',
    } },
  });
}
