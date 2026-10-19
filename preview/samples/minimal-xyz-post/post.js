// MIT — Copyright (c) 2026 Macadam contributors. See the repository LICENSE.
// Preview definition data only. No per-move JavaScript callback is executed by export.
/** @type {import('../../types/postprocessor-api').PostEventBlocks<'x' | 'y' | 'z'>} */
const rapid = [{ line: [
  { text: 'G0' },
  { value: 'x', prefix: ' X', precision: 'coordinate' },
  { value: 'y', prefix: ' Y', precision: 'coordinate' },
  { value: 'z', prefix: ' Z', precision: 'coordinate' },
] }];

/** @type {import('../../types/postprocessor-api').PostEventBlocks<'x' | 'y' | 'z' | 'feed'>} */
const linear = [{ line: [
  { text: 'G1' },
  { value: 'x', prefix: ' X', precision: 'coordinate' },
  { value: 'y', prefix: ' Y', precision: 'coordinate' },
  { value: 'z', prefix: ' Z', precision: 'coordinate' },
  { value: 'feed', prefix: ' F', precision: 'coordinate' },
] }];

/** @type {import('../../types/postprocessor-api').Postprocessor} */
const post = {
  id: 'default',
  name: 'Example XYZ (Preview)',
  apiVersion: '2',
  extension: 'nc',
  mime: 'text/plain',
  profile: {
    units: 'mm',
    modalFeed: false,
    axes: 'xyz',
    arcs: 'none',
    helices: false,
    fullCircles: false,
    defaultToolChange: 'manual',
    comment: { prefix: '(', suffix: ')' },
    events: {
      programStart: [
        { line: [{ text: 'G21' }] },
        { line: [{ text: 'G90' }] },
        { line: [{ text: 'G17' }] },
        { line: [{ text: 'G' }, { value: 'workOffset', precision: 'integer' }] },
      ],
      operationStart: [{ comment: [{ text: 'operation: ' }, { label: 'operationName' }] }],
      operationEnd: [],
      toolChangeManual: [
        { line: [{ text: 'M5' }] },
        { comment: [{ text: 'Load tool: ' }, { label: 'toolName' }] },
        { line: [{ text: 'M0' }] },
      ],
      spindleCW: [{ line: [{ text: 'M3 S' }, { value: 'rpm', precision: 'integer' }] }],
      spindleStop: [{ line: [{ text: 'M5' }] }],
      coolantOff: [{ line: [{ text: 'M9' }] }],
      rapid,
      linear,
      retractRapid: rapid,
      retractFeed: linear,
      programEnd: [{ line: [{ text: 'M2' }] }],
    },
  },
};

module.exports = post;
