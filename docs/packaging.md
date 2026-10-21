# Package format, modules and integrity

A package is a local folder of UTF-8 text. It is installed by selecting the folder, not by running npm or importing it into the document. Binary images, native libraries, WASM binaries, node_modules and remote dependencies are not supported package content.

## Manifest

```json
{
  "id": "com.example.workshop",
  "name": "Workshop Helpers",
  "version": "1.0.0",
  "apiVersion": "1",
  "entry": "index.js",
  "capabilities": ["command:run", "document:read", "parameters:write"],
  "icon": "assets/icon.svg"
}
```

| Field | Required | Contract |
| --- | --- | --- |
| `id` | Yes | Reverse-DNS spelling matching `^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$` |
| `name` | Yes | Nonblank string, at most 100 JavaScript string code units |
| `version` | Yes | `^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$`, e.g. `1.0.0` or `1.1.0-beta.1`; no build-metadata `+suffix` |
| `apiVersion` | Yes | String `'1'`, not number `1` |
| `entry` | Yes | Included path ending `.js`; its UTF-8 source is at most 256 KiB |
| `capabilities` | Yes | Array, including an empty array if appropriate; no duplicates or unknown names |
| `icon` | No | Included path ending `.svg`; UTF-8 text. This declares an asset, not a custom toolbar or guaranteed icon rendering location. |
| `integrity` | No | `'sha256-'` followed by exactly 64 lowercase hexadecimal digits |

The version validator checks this syntax, not the complete Semantic Versioning specification or ordering. The installer does not choose a newer release, prevent a downgrade, verify a publisher or contact a registry. A package with the same ID replaces the locally installed package after validation. Unknown top-level manifest fields are rejected by native registration; do not add arbitrary `permissions`, `dependencies`, `url`, `minimumAppVersion` or `settings` fields.

The production reference accepts these five API 1 capabilities:

| Capability | Host use |
| --- | --- |
| `command:run` | Register/invoke commands |
| `document:read` | Include the copied summary in command context |
| `parameters:write` | Accept a command's numeric `setParameter` action; also required by preview author parameter steps |
| `feature:solid` | Register a solid definition; requires `kernel:build` too |
| `kernel:build` | Permit that native solid template; requires `feature:solid` too |

The staging preview adds `document:author` (author programs) and `cam:postprocess` (post registration).
`kernel:build` also authorizes author programs in combination with `document:author`; parameter steps
additionally require `parameters:write`. Neither new capability is accepted by the production reference.
See [compatibility](compatibility.md), [authoring](authoring.md) and [postprocessors](postprocessors.md).

These names are not general OAuth scopes or operating-system permissions. [Security](security.md) separates the checks from the remaining trust requirements.

## Folder limits

- At most **64 included files**, at most **4 MiB** of UTF-8 text in total.
- Entry source at most **256 KiB**. The total limit still applies to helper modules and assets.
- Relative paths at most **180 JavaScript string code units**, with `/` separators. Each segment must match `[a-zA-Z0-9_][a-zA-Z0-9_.-]*`; absolute paths, backslashes, `..` and empty segments are rejected in stored package paths.
- Folder readers omit hidden files/directories, including editor/Finder metadata. Do not put required modules in dot folders.
- Native Mac folder reading rejects symbolic links. Browser folder selection provides file contents and does not promise an equivalent filesystem/symlink security check.
- Every included file must decode as UTF-8, including assets. An unrelated PDF/PNG/ZIP in the chosen folder can make installation fail; distribute a clean package folder.

## Package-local JavaScript modules

No module loader installation is needed. The host supports a small CommonJS-style loader:

```js
// index.js
const format = require('./lib/format.js');
module.exports.activate = function (host) {
  host.registerCommand({
    id: 'hello', name: 'Hello',
    run() { return { type: 'message', text: format.greeting('Maker') }; },
  });
};
```

```js
// lib/format.js
exports.greeting = function (name) { return 'Hello, ' + name + '.'; };
```

Requests must start `./` or `../`, end `.js`, and resolve inside the package. `../` is allowed only while remaining within the package root. Bare module names, URLs, absolute paths, missing files and dependency cycles fail. Extensions are never inferred. There is no `require('fs')`, npm resolution, JSON module import or `require` access to arbitrary text/SVG files.

ES module syntax (`import`/`export`) is not the package loader protocol. Dynamic imports or browser-specific globals are not supported escape hatches. Compile/bundle externally if your authoring language requires it, but distribute only a compliant JavaScript/text folder; no build tool is required for the examples here.

## Optional integrity hash

Integrity checks whether installed JavaScript matches a digest declared by its own manifest. It is **not a signature** and does not authenticate a publisher. If an attacker can replace both source and manifest, they can replace this hash too. It does not cover the manifest or non-JavaScript assets.

For exactly one `.js` file, hash the entry's raw UTF-8 bytes with SHA-256. For multiple `.js` files:

1. Collect **all included `.js` paths**, even modules not imported by the entry.
2. Sort the safe ASCII paths lexically.
3. For each path, append `UTF8ByteLength(path) + '\n' + path + UTF8ByteLength(source) + '\n' + source`.
4. Concatenate those records with **no additional separators**, then hash its UTF-8 bytes.
5. Store `'sha256-' + lowercaseHexDigest` in `integrity`.

Do not normalize line endings, trim text, hash character counts instead of UTF-8 bytes, or include `plugin.json` in this source digest. Changing source or a helper path requires recomputing the hash or removing the optional field before reinstalling. A package-local module cannot compute/approve its own installation hash; verification happens before entry activation.

For a first plugin, omit `integrity`. Add it as a distribution consistency check when you have a reproducible packaging process. Keep actual publisher verification and trusted distribution separate.
