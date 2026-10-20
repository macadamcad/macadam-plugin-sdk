# Workshop Utilities

Install this folder, then run **Document Report** to count timeline features by kind and unresolved named parameters. **Set 2 mm Machining Allowance** creates or updates `stockAllowance` in one ordinary undo entry.

The entry uses nested package-local CommonJS modules. Its manifest requests `command:run`, `document:read` and `parameters:write`. Source, manifest and icon are copied unchanged from Macadam's shipping examples; the digest covers all four JavaScript files.

To link this utility to the stock example, add **Oversize Stock**, then set **Allowance per side** to `stockAllowance`. The parameter action uses 0.002 metres, equal to 2 mm.

The snapshot includes summary data only, not bodies or feature recipes. The setter uses the host's literal-parameter action: an existing formula-defined `stockAllowance` is refused rather than overwritten. For a preflight check and user-facing refusal before returning an action, see [machining-allowance](../machining-allowance). This update did not execute either example.
