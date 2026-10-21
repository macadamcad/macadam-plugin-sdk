# Compatibility and migration

## Supported release boundary

This documentation targets **local package API 1**, reviewed against browser snapshot `6058b429cf76544752374a7253036ba5187b665b`. Its local package host surfaces retain the same source contract as the earlier documented `9b02ab40176298e97382880b466b764e91713809` snapshot. The Mac host source implements the matching registration/summary/action contract; native execution and UI behaviour still need checking on the exact binary you distribute against.

The declarations retain the production summary/template contract and add explicitly marked preview author/post types. Publishing declarations does not add methods to the running Macadam host. This documentation update did not run samples, a browser, native builds or CI. Newer app releases should explicitly state which package protocol/features they support; do not infer support from an application version number alone.

| Version identifier | Meaning |
| --- | --- |
| Manifest `apiVersion: '1'` | Installed package/registration protocol |
| `host.apiVersion === '1'` | Same runtime package protocol |
| Manifest `version: '1.2.0'` | Your package implementation version; saved feature nodes pin it exactly |
| Postprocessor definition `apiVersion: '2'` | Separate **staging preview** profile contract; not package protocol 2 |
| Editor automation API version | Different scripting surface; not available through a package's host |

## Explicit release matrix

| Host revision | Package commands/templates | Author action | Post registration API 1/2 | Qualification |
| --- | --- | --- | --- | --- |
| Production reference `6058b429cf76544752374a7253036ba5187b665b` | Supported | Absent | Absent | Earlier production documentation baseline |
| Preview contract `f372c6ad290018d1e9a59926d80588b5e1e5bb96` | Retained | Implemented | Implemented | Source-reviewed preview additions; not a production release claim |
| Staging browser `886836a1dbf2704ffbbff8e10ba8393f3f5ba556` | Retained | Same f372 contract | Same f372 contract | Actual staging revision at this documentation snapshot |
| Native app | Earlier API 1 source contract | Preview integration source present | Preview integration source present | Binary execution, UI/transport parity and packaging unqualified |

No new build, test, sample execution or CI run was performed for this SDK source review. A previously
reported host acceptance result is separate from execution of the corrected SDK sample. Never infer
support in all future builds from “f372 or newer”; check the host's documented support. The manifest has
no minimum-app-version field, and `host.apiVersion` remains `'1'` across these additions.

The added declarations describe production plus preview types; they do not extend the running host.
New capabilities fail closed on the production reference. Keep preview package distributions clearly
labelled and separate from production-compatible examples.

## Upgrade a command-only package

Keep the package ID and command IDs stable. Change source, increment the package version, recalculate optional integrity, and ask the user to install the edited folder. The host replaces the package under the same ID. Names may change without changing IDs, but warn users about renamed commands or changed parameter targets.

API 1 has no automatic update service, app-version constraints in the manifest, persistent settings migration or publisher validation. Test on your supported browser/Mac versions and state them in your package README.

## Upgrade a feature package

Saved feature nodes store package ID, exact package version, feature type ID and parameter expressions. Only one installed package version exists for a given package ID. An installed version mismatch intentionally reports an unavailable feature rather than silently changing a saved model.

Before releasing:

1. Keep a distributable copy of every package version needed by existing projects.
2. Preserve IDs and document changes to parameter units/defaults/geometry interpretation.
3. Verify an old document with its original package before doing any migration.
4. If supporting two independent implementations side by side, use distinct package IDs and document the manual recreation/migration path. Merely renaming an ID does not migrate saved nodes.
5. Do not instruct users to hand-edit saved documents or relabel versions to bypass required-version checks.

There is no supported package callback/action to migrate existing plugin nodes, rewrite their required version or translate stored parameter maps. That is a missing host capability, not a task a hidden API can safely solve. Reinstalling the exact old version restores the definition expected by the old node, subject to the host's supported protocol.

Changing source while keeping the same version is useful for local experimentation but can change existing geometry with no version mismatch. Do not do this in a released feature package. A version string is a compatibility promise, not a source hash; the optional package integrity field is separate and does not get embedded as the saved feature's version identity.

## API 2 preview separation

`cam:postprocess`, `document:author`, `host.registerPostProcessor`, and returned author actions are absent from the production reference runtime. They are implemented in the explicitly listed staging preview. The preview package still uses manifest `apiVersion: '1'`, but requires the matching preview capability and host implementation. Author programs use the package protocol independently of post definition versions; see [authoring](authoring.md). Its definition uses `apiVersion: '2'`.

Do not add the preview capability to a shipping command/geometry package and expect partial installation. Unknown capabilities fail closed. Keep preview packages separate and label their required host support clearly. See [preview authoring](../preview/authoring-walkthrough.md).
