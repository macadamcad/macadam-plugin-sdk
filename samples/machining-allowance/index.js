// MIT — Copyright (c) 2026 Macadam contributors. See the repository LICENSE.
// CAM-adjacent parameter workflow only. This cannot create a CAM setup/toolpath or control a machine.
/** @param {import('../../types/local-plugin-api').LocalPluginHost} host */
function activate(host) {
  const parameterName = 'machiningAllowance';
  const allowanceMetres = 0.002;
  function current(context) {
    if (!context.document) throw new Error('This helper requires document:read');
    return context.document.parameters.find(p => p.name === parameterName);
  }
  host.registerCommand({
    id: 'report', name: 'Report Machining Allowance',
    run(context) {
      const p = current(context);
      if (!p) return { type: 'message', text: 'No machiningAllowance parameter. Run Set 2 mm Machining Allowance to create it.' };
      if (!p.resolved || p.kind !== 'length' || typeof p.value !== 'number' || !Number.isFinite(p.value)) {
        return { type: 'message', text: 'machiningAllowance is not a resolved finite length. Fix its definition in Parameters.' };
      }
      return { type: 'message', text: 'Machining allowance: ' + (p.value * 1000).toFixed(3) + ' mm' +
        (p.expression !== null ? ' (formula: ' + p.expression.slice(0, 160) +
          (p.expression.length > 160 ? '…' : '') + ')' : ' (literal)') };
    },
  });
  host.registerCommand({
    id: 'setAllowance', name: 'Set 2 mm Machining Allowance',
    run(context) {
      const p = current(context);
      if (p && (p.kind !== 'length' || !p.resolved || p.expression !== null)) {
        return { type: 'message', text: 'Not changed: machiningAllowance must be a resolved literal length. Review its existing definition in Parameters.' };
      }
      return { type: 'setParameter', name: parameterName, kind: 'length', value: allowanceMetres };
    },
  });
}
