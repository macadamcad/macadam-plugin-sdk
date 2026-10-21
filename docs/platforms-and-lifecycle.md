# Platforms, installation and lifecycle

## Platform boundary

The shipping reference is browser snapshot `6058b429cf76544752374a7253036ba5187b665b`. The Mac host source implements the same API 1 manifest, registration and action contract. Source parity does not imply that this documentation update ran native binaries or every browser.

| Behaviour | Browser | Native Mac |
| --- | --- | --- |
| Execution | Fresh disposable Worker | Fresh JavaScriptCore realm |
| Native API 1 host | Through shared native/WASM validation | Through shared native validation |
| Command availability limit | 3 seconds including activation; Worker terminated | No equivalent counted execution budget |
| Install UI | Settings → Plugins → Install Folder…; browser directory selection | Settings Plugins section and Plugins menu; native folder picker |
| Installed package storage | Browser `localStorage`, per origin/profile | User Application Support, `Macadam/Plugins`, copied package files as JSON |
| Folder edits watched | No | No |
| Symlink check | Browser supplies selected file contents; no equivalent filesystem guarantee | Symbolic links rejected |
| Palette contributions | Yes | Yes |
| Arbitrary panels/file/network bridges | No supported API | No supported API |

Windows/Linux **browser** use follows the browser column, subject to directory-picker support. This SDK makes no claim that a native Windows/Linux plugin installation manager is shipped or qualified. An unsupported browser folder picker is a host/browser limitation, not permission to import a script from a remote URL.

## Install and restore

1. The user chooses a folder and approves its stated permissions/trust prompt.
2. The host validates manifest, package limits and optional integrity.
3. It activates the package in fresh realms and compares two registrations for equality.
4. Native validation accepts the contributions, then the host persists the copied files and updates commands/geometry definitions. A failed persistence step attempts to restore the previous registration.
5. On a later app load, the host restores its locally saved copies. Invalid packages report restore errors rather than becoming document data.

Installation is application state. It does not create a document feature and is not part of document Undo. A command is run only when invoked; the host does not supply background jobs, timers, event subscriptions or a document-change callback.

## Reload versus update

**Reload** validates and reactivates the installed copy. It resets module/activation state; it does not reread the folder originally selected by the user.

To update files, select **Install Folder…** again. The same package ID replaces the installed package. There is one installed definition per package ID, not side-by-side versions. The host does not fetch updates, compare release ordering, migrate saved feature parameters or keep a version catalogue for you.

Native registration validation is atomic: invalid new definitions leave the existing registry intact. Do not assume every possible storage/operating-system failure is a cross-system transaction; keep the previous package available and verify the installed UI after an error.

## Commands and cancellation

Each invocation starts with a new activation and copied current summary, then runs a synchronous callback. There is no durable JavaScript state shared between invocations.

- Cancel the folder chooser or installation trust prompt to avoid installing a new package.
- A thrown error, rejected result or browser timeout applies no command action.
- Once a valid numeric edit is applied, use document **Undo**. There is no plugin cancel handle or progress/cancellation callback.
- Native code does not provide the browser's execution timeout. Do not use a slow loop as a cancellable task.
- No action-array transaction or plugin rollback callback exists. The [staging author action](authoring.md) is a distinct single-result transaction for creating parameters/features; it is not available in the production reference.

## Staging preview lifecycle

Read the [release matrix](compatibility.md) before installing an author/post package. Source integration
is present in the preview browser/native code, but native binary parity and packaging are unqualified.
Browser authoring checks document JSON, boundary generation and package identity before applying its
single Undo entry. This check is not asserted for the native runner. Author-created ordinary records
are distinct from plugin-template nodes and do not need a JavaScript evaluator during replay.
Bundled `com.macadam.posts.*` packages are host-owned; user packages cannot replace or uninstall them.

## Feature creation and undo

Run **Add <feature name>** to insert a feature at the current root timeline marker. The host creates its stable document identity and records it through its normal document command path. The package does not mint document IDs, receive the result ID in an activation callback or choose a nested insertion target.

Numeric inspector edits and parameter changes use the host's normal editing paths. This SDK does not specify the host's total undo-history capacity or a plugin-specific undo stack. A geometry definition change caused by package replacement is application state, not an undoable document edit.

## Uninstall and portability

Uninstall removes the installed local package/definitions and its command contributions. It does not delete saved feature nodes or document parameters authored by the plugin. A model requiring a missing definition/version reports that the plugin feature is unavailable and retains its stored parameter data.

Package installation is not synced with a document. Browser production and staging are different origins and therefore have separate installed copies; another browser profile and the Mac app also need separate installation. Clearing browser site data can remove packages. Share the package/version alongside the project through your own trusted distribution process.

There is no supported plugin API for private persistent settings, arbitrary local files, cloud package storage, login credentials, automatic updates or shared cross-document state. A named document parameter is visible project data, not a substitute for secret or hidden plugin storage.
