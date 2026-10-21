# Author Plate — staging preview

A standalone package for the preview author action; no private Macadam source or build tools are needed.
Requires the preview browser contract at `f372c6ad290018d1e9a59926d80588b5e1e5bb96` (present in the
staging browser revision `886836a1dbf2704ffbbff8e10ba8393f3f5ba556`). Production reference
`6058b429cf76544752374a7253036ba5187b665b` does not accept these new capabilities.
Native binaries and controller behavior are unqualified by this source-only SDK review.

1. Open a new document on the compatible staging host.
2. Select Settings → Plugins → Install Folder… and select this folder. Confirm its five permissions.
3. Run **Author a square plate (preview)** from Plugins or the command palette.
4. Inspect the editable sketch, polygon and extrusion. The polygon has circumradius 10 mm and four sides;
   extrusion depth is 20 mm. It does not make a 100 × 60 mm rectangle or a hole.
5. Edit `examplePlateRadius` or `examplePlateDepth` in the document to change the model. Undo the
   authoring action to remove its parameters and features together; Redo restores them.

The author action has five steps. Parameter creation requires `parameters:write` in addition to
`document:author` and `kernel:build`; this sample uses `document:read` to detect existing names.
It returns a message if either example parameter already exists. A second invocation does not
silently overwrite definitions. Reinstall after editing the source; installed files are copies.

The exact keys, values, scope and reference encoding are documented in
[Document authoring](../../docs/authoring.md). This corrected example was source-reviewed, not executed.
