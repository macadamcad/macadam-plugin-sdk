const { documentReport } = require('./lib/report.js');
const { machiningAllowance } = require('./lib/actions.js');

function activate(host) {
  host.registerCommand({
    id: 'report', name: 'Document Report', icon: 'doc',
    run({ document }) { return documentReport(document); },
  });
  host.registerCommand({
    id: 'allowance', name: 'Set 2 mm Machining Allowance', icon: 'measure',
    run() { return machiningAllowance(); },
  });
}
