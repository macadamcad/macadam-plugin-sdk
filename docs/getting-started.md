# Your first plugin

This creates a command that displays a greeting. It needs no document permissions and does not change the model.

## 1. Create two text files

Create a folder named `my-hello-plugin`. Place these files directly inside it:

```text
my-hello-plugin/
  plugin.json
  index.js
```

`plugin.json`:

```json
{
  "id": "com.example.my-hello",
  "name": "My Hello Plugin",
  "version": "1.0.0",
  "apiVersion": "1",
  "entry": "index.js",
  "capabilities": ["command:run"]
}
```

Use your own stable reverse-DNS identifier when distributing a package. The `com.example` prefix is for examples; it does not require a network service or domain lookup.

`index.js`:

```js
function activate(host) {
  if (host.apiVersion !== '1') throw new Error('This plugin needs package API 1');
  host.registerCommand({
    id: 'hello',
    name: 'Say Hello',
    run() {
      return { type: 'message', text: 'Hello from my first Macadam plugin.' };
    },
  });
}
```

JavaScript is loaded as a script, not an ES module. Register synchronously. Do not add `export`, an asynchronous `activate`, a `Promise` result, an npm import or a call to `macadam`.

## 2. Install the folder

1. Open Macadam and open or create a document.
2. Open the **Settings** inspector and find **Plugins**. In the native Mac app, the **Plugins** menu also provides **Install Folder…**.
3. Choose **Install Folder…** and select `my-hello-plugin`, the folder that directly contains `plugin.json`.
4. Review the package name and permissions, then choose **Install**.

Choose the folder, not `index.js` or the parent of the folder. If you downloaded a ZIP, extract it first. Folder selection in a browser depends on that browser's directory-picker support.

## 3. Run the command

Open the command palette with **⌘Enter** on Mac or **Ctrl+Enter** on Windows/Linux, search for **Say Hello**, then run it. The installed package also has a command button in Plugins settings. The native Mac app lists package commands in the Plugins menu.

Expected result: the app displays `Hello from my first Macadam plugin.` The model and undo history should not change. The palette contribution has the stable command ID `plugin.com.example.my-hello.command.hello`.

## 4. Edit and update

Change the greeting, save `index.js`, then choose **Install Folder…** again and select the same folder. Reusing the package ID replaces the installed package. **Reload** reactivates the already copied files; it does not reread your development folder.

For command-only development you can reinstall the same version. For a released package, increment `version`. Feature packages need additional care: saved feature nodes require an exact package version. Read [migration](compatibility.md) before changing a geometry package.

## 5. Add only the permissions you need

To inspect a document summary, add `document:read`. To return a literal parameter edit, also add `parameters:write`. For editable primitive geometry, use `feature:solid` plus `kernel:build` and follow [feature authoring](feature-authoring.md).

There is no supported package API for selecting a face, running an Extrude command, creating a panel, downloading a file or issuing a toolpath. See the [capability matrix](capabilities.md) before expanding this example.

If the package does not install, consult [troubleshooting](troubleshooting.md). Before sharing it, work through the [conformance checklist](conformance-checklist.md).
