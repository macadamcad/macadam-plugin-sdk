# Plugin documentation

This is a self-contained guide for local package API 1. You need Macadam, a text editor and a folder picker. You do not need Macadam's application source, npm, TypeScript, a native compiler or a package manager.

| Question | Read |
| --- | --- |
| Can my idea be implemented as a plugin today? | [Capabilities and unavailable APIs](capabilities.md) |
| How do I build and install a first plugin? | [Getting started](getting-started.md) |
| What fields and methods exist? | [API reference](api-reference.md), [TypeScript declarations](../types/local-plugin-api.d.ts) |
| How do command input, results, units and errors work? | [Command authoring](command-authoring.md) |
| How do I make editable geometry? | [Feature authoring](feature-authoring.md), [primitive catalogue](primitive-catalogue.md) |
| Which files, manifest values and modules are allowed? | [Packaging](packaging.md) |
| Is it sandboxed? What do permissions really enforce? | [Security and trust](security.md) |
| What is stored, updated, undone or cancelled? | [Platforms and lifecycle](platforms-and-lifecycle.md) |
| How do I upgrade a package without breaking saved models? | [Compatibility and migration](compatibility.md) |
| Why did installation or a command fail? | [Troubleshooting](troubleshooting.md) |
| What should I verify before release? | [Conformance checklist](conformance-checklist.md) |
| Can I write a CAM postprocessor? | [API 2 preview](../preview/README.md), [preview walkthrough](../preview/authoring-walkthrough.md) |

## Three distinct APIs

1. **Local package host** — this guide; `activate(host)` receives two registration methods and no application object.
2. **Editor automation** — scripts run deliberately in an editor/console context can have broader `macadam.*` APIs. A method existing there does not make it callable from an installed package. This SDK does not grant or document a back door to that context.
3. **Postprocessor API 2 preview** — declarative CAM export profiles for a future host, with a separate contract and unit convention. It is not part of the shipping local API 1 permission vocabulary.

Use the first interface only when its supported inputs and outputs meet your needs. Unsupported requirements need a host API addition; do not depend on undocumented globals or private source modules.
