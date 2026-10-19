/** @param {import('../../types/local-plugin-api').LocalPluginHost} host */
function activate(host) {
  host.registerCommand({
    id: 'hello',
    name: 'Hello from a Plugin',
    icon: 'plugin',
    actsOn: 'none',
    run() {
      return { type: 'message', text: 'Hello from your Macadam plugin.' };
    },
  });
}
