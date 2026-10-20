# Machining allowance helper

A complete, shipping API 1 example for a CAM-adjacent workflow. It adds two commands:

- **Report Machining Allowance** reads a named length and displays millimetres. It checks resolution state, numeric type and units.
- **Set 2 mm Machining Allowance** creates or updates the literal document parameter `machiningAllowance`. It refuses a different kind, an unresolved value or a formula, preserving the existing definition. The returned number is `0.002` metres.

Install this folder. Run the setter, inspect **Parameters**, then run the report. Expected value: **2 mm**. Use the app's **Undo** to reverse the edit. If the parameter is used in model expressions, those normal model dependencies can update; this helper does not wire them automatically.

This example demonstrates honest capability scope: it does **not** create a machine, tool, machining setup, operation, toolpath, G-code or simulation. API 1 has no API for those actions. Controller postprocessor authoring is a separate [unshipped API 2 preview](../../preview/README.md).

The requested capabilities are exactly `command:run`, `document:read`, `parameters:write`. The parameter is visible project data, not secret or hidden plugin storage. Source-reviewed only in this documentation update; no execution or machine/controller qualification is claimed.
