# Getting started

## Install a command

1. Download or clone this repository. Extract a ZIP download.
2. Open a document in Macadam. Choose **Plugins → Install Folder…**. The web Console also exposes a Plugins button.
3. Select `samples/hello-command`, containing `plugin.json` and `index.js`.
4. Review the package permissions, install it, and run **Hello from a Plugin** from Plugins or the command palette.

The command displays `Hello from your Macadam plugin.` It does not need access to the document.

## Edit a package

Edit `index.js` in your editor, then install the edited folder again. **Reload** reactivates the already installed snapshot; it does not reread your source folder. Packages are copied into local application/browser storage and do not sync with documents.

The entry registers contributions synchronously:

```js
function activate(host) {
  host.registerCommand({
    id: 'hello',
    name: 'Hello from a Plugin',
    run() {
      return { type: 'message', text: 'Hello from your Macadam plugin.' };
    },
  });
}
```

No runtime import is needed. For editor completion, add a JSDoc annotation referencing [the declarations](../types/local-plugin-api.d.ts):

```js
/** @param {import('../../types/local-plugin-api').LocalPluginHost} host */
function activate(host) {
  // Register commands or declarative solid features here.
}
```

That relative type path applies to `samples/<name>/index.js` in this repository. Adjust it if you move the source. Type declarations are optional authoring aids; Macadam installs JavaScript.

## Read a document and edit a parameter

Install `samples/document-report`. **Document Report** reads a copied feature/parameter snapshot. **Set 2 mm Machining Allowance** creates or updates `stockAllowance` through a host action, as one normal undo entry. Its action uses `value: 0.002` because command length values use metres.

## Add a solid template

Install `samples/parametric-stock` and choose **Add Oversize Stock**. Its ordinary inspector exposes four length expressions. Defaults produce 104 × 64 × 22 mm. After running the allowance command, set **Allowance per side** to `stockAllowance` to link the examples.

Template fields contain expressions, not precomputed JavaScript geometry. Macadam evaluates the registered native primitive recipe. Undo/redo and document persistence use the normal feature path. Keep the matching plugin package available on every machine that evaluates that document.

Uninstalling a package preserves its document feature and parameter intent; the unavailable feature remains visible. Reinstall the required package version to restore evaluation.

For multi-file CommonJS packages, integrity rules, permissions and limits, see the [API reference](api-reference.md). For postprocessors, use the separately marked [preview](../preview/README.md).
