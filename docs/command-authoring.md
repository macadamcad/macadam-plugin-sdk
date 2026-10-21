# Command authoring

A command computes one action from a copied summary. It does not hold a live document or a selection. Keep it synchronous, deterministic and small.

## Read a parameter safely

The manifest needs `command:run` and `document:read`. This command reads a length in metres and reports millimetres. It refuses missing, unresolved or wrong-kind input rather than treating an old value as current.

```js
function activate(host) {
  host.registerCommand({
    id: 'reportWidth',
    name: 'Report Width',
    run(context) {
      const parameters = context.document && context.document.parameters;
      const width = parameters && parameters.find(p => p.name === 'width');
      if (!width) return { type: 'message', text: 'Create a document parameter named width first.' };
      if (!width.resolved || width.kind !== 'length' ||
          typeof width.value !== 'number' || !Number.isFinite(width.value)) {
        return { type: 'message', text: 'width must be a resolved finite length.' };
      }
      return { type: 'message', text: 'Width: ' + (width.value * 1000).toFixed(2) + ' mm' };
    },
  });
}
```

If the manifest lacks `document:read`, `context.document` is absent. Permission denial does not produce an empty document summary. A copied `features` row provides names, kinds, IDs and containing paths, not a body or feature recipe.

## Return one parameter edit

Add `parameters:write` to set a literal value. A 2 mm length is `0.002`, not `2`:

```js
host.registerCommand({
  id: 'setAllowance',
  name: 'Set 2 mm Allowance',
  run() {
    return { type: 'setParameter', name: 'stockAllowance', kind: 'length', value: 0.002 };
  },
});
```

The host applies the result after the callback completes. It creates a missing parameter, or edits an existing literal. It refuses an existing formula-defined parameter. There is no command action for deliberately replacing a formula; the user must change the definition in the app.

For a safe update, request `document:read` too and check `expression`, `kind` and `resolved` before returning the action. The [machining-allowance example](../samples/machining-allowance) does this and returns a message instead of overwriting a formula or a parameter with different units.

## Units

| Value | Plugin numeric result | Template/default expression |
| --- | --- | --- |
| 20 mm | `0.02` with kind `length` | `'20mm'` |
| 90 degrees | `Math.PI / 2` with kind `angle` | `'90deg'` |
| Ratio 1.25 | `1.25` with kind `scalar` | `'1.25'` |
| Six sides | No count-valued document action | `'6'` in a feature `count` parameter |

Use explicit units in length/angle expression strings. Do not copy the millimetre convention from the CAM postprocessor preview into a command action: its unit boundary is different.

## Palette metadata is not interactive input

`actsOn: 'face'` can help the shared palette rank a command when a face is selected. It does not pass that face to `run`, enforce that a face is selected, open a picker or let a package inspect selection. Likewise, `icon` and `shortcut` decorate the host's contribution; they do not grant UI capabilities.

For portable packages, start with `icon: 'plugin'`, no shortcut, and `actsOn: 'none'`. Add a shortcut only if it does not conflict with the host or the user's workflow. API 1 supplies no shortcut-conflict negotiation callback.

## State, errors and time

- Use ordinary local variables for one invocation. A fresh realm is created for the next invocation; a counter or cached summary is not persistent state.
- Register the same metadata on every activation. Installation compares two independent registrations for equality.
- Return a message for an expected unmet precondition. Throw an `Error` for an invalid package/program condition. Do not catch a failure and return a fake success.
- Never return a `Promise`, schedule a document edit, wait for a network request, or assume timers will be serviced. There is no asynchronous command protocol.
- Browser execution has a 3-second watchdog covering activation plus execution. It terminates the Worker and applies no returned action on timeout. This is an availability limit, not a geometry correctness check. The native implementation has no equivalent counted execution budget; keep native computations bounded too.
- A command returns **one** action. Production has no action-array transaction. The [staging author action](authoring.md) can create multiple parameters/features as one transaction; it does not add prompts, async work or progress callbacks.

Use the app's Undo for a successfully applied parameter edit. Package installation, reloading and uninstallation are application state, not undoable document edits.
