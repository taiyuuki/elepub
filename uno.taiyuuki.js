const shadow = [
  [
    /shadow-([\d\.]+)(\W*)/,
    ([, d, u]) => ({ 'box-shadow': ` 0 0 ${d}${u || 'px'} var(--font-color)` }),
  ],
  [
    /shadow-([A-z\-]+)-([\d\.]+)(\W*)/,
    ([, c, d, u]) => ({ 'box-shadow': ` 0 0 ${d}${u || 'px'} var(--${c})` }),
  ],
];

const margin = [
  ['m-auto', { margin: 'auto' }],
  ['m-t-auto', { 'margin-top': 'auto' }],
  ['m-r-auto', { 'margin-right': 'auto' }],
  ['m-b-auto', { 'margin-bottom': 'auto' }],
  ['m-l-auto', { 'margin-left': 'auto' }],
  ['m-x-auto', { 'margin-left': 'auto', 'margin-right': 'auto' }],
  ['m-y-auto', { 'margin-top': 'auto', 'margin-bottom': 'auto' }],
  [/^m-([\d\.]+)(\D*)$/, ([, d, w]) => ({ margin: `${d}${w || 'px'}` })],
  [
    /^m-x-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'margin-left': `${d}${w || 'px'}`,
      'margin-right': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^m-y-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'margin-top': `${d}${w || 'px'}`,
      'margin-bottom': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^m-l-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'margin-left': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^m-r-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'margin-right': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^m-t-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'margin-top': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^m-b-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'margin-bottom': `${d}${w || 'px'}`,
    }),
  ],
];

const border = [
  [
    /^border-style-(\W+)$/,
    ([, t]) => ({
      'border-style': t,
    }),
  ],
  [
    /^border-([\d\.]+)(\D*)$/,
    ([, d, u]) => ({
      'border-width': `${d}${u || 'px'}`,
    }),
  ],
  [
    /^border-([A-z\-]+)$/,
    ([, color]) => ({
      'border-color': `var(--${color})`,
    }),
  ],
  [
    /^border-color-([A-z\-]+)$/,
    ([, color]) => ({
      'border-color': `var(--${color})`,
    }),
  ],
  [
    /^border-(#[0-9A-Fa-f]+)$/,
    ([, color]) => ({
      'border-color': color,
    }),
  ],
  [
    /^border-color-(#[0-9A-Fa-f]+)$/,
    ([, color]) => ({
      'border-color': color,
    }),
  ],
  [
    /^border-width-([\d\.]+)(\D*)$/,
    ([, d, u]) => ({
      'border-width': `${d}${u || 'px'}`,
    }),
  ],
  [
    /^border-radius-([\d\.]+)(\D*)$/,
    ([, d, u]) => ({
      'border-radius': `${d}${u || 'px'}`,
    }),
  ],
  ['border-box', { 'box-sizing': 'border-box' }],
  ['border-solid', { 'border-style': 'solid' }],
  ['outline-0', { outline: '0' }],
];

const padding = [
  ['p-auto', { padding: 'auto' }],
  [/^p-([\d\.]+)(\D*)$/, ([, d, w]) => ({ padding: `${d}${w || 'px'}` })],
  [
    /^p-x-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'padding-left': `${d}${w || 'px'}`,
      'padding-right': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^p-y-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'padding-top': `${d}${w || 'px'}`,
      'padding-bottom': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^p-l-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'padding-left': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^p-r-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'padding-right': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^p-t-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'padding-top': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^p-b-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'padding-bottom': `${d}${w || 'px'}`,
    }),
  ],
];

const content = [
  ['w-auto', { width: 'auto' }],
  ['w-max-auto', { 'max-width': 'auto' }],
  ['w-content', { width: 'fit-content' }],
  ['h-auto', { height: 'auto' }],
  ['h-max-auto', { 'max-height': 'auto' }],
  ['h-content', { height: 'fit-content' }],
  [
    /^w-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      width: `${d}${w || 'px'}`,
    }),
  ],
  [
    /^w-p-([\d\.]+)$/,
    ([, d]) => ({
      width: `${d}%`,
    }),
  ],
  [
    /^w-max-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'max-width': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^w-min-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'min-width': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^h-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      height: `${d}${w || 'px'}`,
    }),
  ],
  [
    /^h-p-([\d\.]+)$/,
    ([, d]) => ({
      height: `${d}%`,
    }),
  ],
  [
    /^h-max-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'max-height': `${d}${w || 'px'}`,
    }),
  ],
  [
    /^h-min-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({
      'min-height': `${d}${w || 'px'}`,
    }),
  ],
];

const position = [
  ['pst-rel', { position: 'relative' }],
  ['pst-abs', { position: 'absolute' }],
  ['pst-fix', { position: 'fixed' }],
  ['pst-stk', { position: 'sticky' }],
  [/^pst-t-([\d\.]+)(\D*)$/, ([, d, w]) => ({ top: `${d}${w || 'px'}` })],
  [/^pst-r-([\d\.]+)(\D*)$/, ([, d, w]) => ({ right: `${d}${w || 'px'}` })],
  [/^pst-b-([\d\.]+)(\D*)$/, ([, d, w]) => ({ bottom: `${d}${w || 'px'}` })],
  [/^pst-l-([\d\.]+)(\D*)$/, ([, d, w]) => ({ left: `${d}${w || 'px'}` })],
];

const zIndex = [/^z-index-([\d\.]+)$/, ([, d]) => ({ 'z-index': d })];

const flex = [
  ['flex-row', { display: 'flex', 'flex-direction': 'row' }],
  ['flex-column', { display: 'flex', 'flex-direction': 'column' }],
  ['row', { display: 'flex', 'flex-direction': 'row' }],
  ['column', { display: 'flex', 'flex-direction': 'column' }],
  ['flex-justify-center', { 'justify-content': 'center' }],
  ['justify-center', { 'justify-content': 'center' }],
  ['flex-justify-between', { 'justify-content': 'space-between' }],
  ['justify-between', { 'justify-content': 'space-between' }],
  ['flex-justify-start', { 'justify-content': 'flex-start' }],
  ['justify-start', { 'justify-content': 'flex-start' }],
  ['flex-wrap', { 'flex-wrap': 'wrap' }],
  ['flex-nowrap', { 'flex-wrap': 'nowrap' }],
  ['flex-items-center', { 'align-items': 'center' }],
  [/^flex-([\d\.]+)$/, ([, d]) => ({ flex: d })],
  [/^flex-([\d\.]+%)$/, ([, d]) => ({ flex: d })],
];

const gap = [
  /^gap-([\d\.]+)(\W*)$/,
  ([, d, u]) => ({ gap: `${d}${u || 'px'}` }),
];

const display = [
  ['display-block', { display: 'block' }],
  ['display-inline-block', { display: 'inline-block' }],
  ['display-none', { display: 'none' }],
  ['display-flex', { display: 'flex' }],
  ['display-grid', { display: 'grid' }],
  ['display-table', { display: 'table' }],

  ['block', { display: 'block' }],
  ['inline-block', { display: 'inline-block' }],
  ['none', { display: 'none' }],
  ['flex', { display: 'flex' }],
  ['grid', { display: 'grid' }],
];

const text = [
  [
    /^text-([\d\.]+)(\D*)$/,
    ([, d, w]) => ({ 'font-size': `${d}${w || 'px'}` }),
  ],
  [/^text-color-([A-z\-]+)$/, ([, color]) => ({ color: `var(--${color})` })],
  [/^text-(#[A-Fa-f0-9]+)$/, ([, color]) => ({ color: color })],
  ['text-bold', { 'font-weight': 'bold' }],
  ['text-center', { 'text-align': 'center' }],
  ['text-left', { 'text-align': 'left' }],
  ['text-middle', { 'vertical-align': 'middle' }],
  ['text-right', { 'text-align': 'right' }],
  ['text-bold', { 'font-weight': 'bold' }],
  ['text-break-all', { 'word-break': 'break-all' }],
  ['text-keep-all', { 'word-break': 'keep-all' }],
  ['text-underline', { 'text-decoration': 'underline' }],
  ['text-nounderline', { 'text-decoration': 'none' }],
  ['text-nowrap', { 'white-space': 'nowrap' }],
  [
    'text-ellipsis',
    {
      'text-overflow': 'ellipsis',
      overflow: 'hidden',
      'white-space': 'nowrap',
    },
  ],
  [
    /^text-shadow-(#[A-Fa-f0-9]+)-([\d\.]+)(\D*)$/,
    ([, c, d, w]) => ({ 'text-shadow': `0 0 ${d + w || 'px'} ${c}` }),
  ],
];

const line = [
  [
    /^line-([\d\.]+)(\D*)$/,
    ([, d, u]) => ({ 'line-height': `${d}${u || 'px'}` }),
  ],
];

const background = [
  [
    /^bg-([A-z\-]+)$/,
    ([, color]) => ({ 'background-color': `var(--${color})` }),
  ],
  [/^bg-(#[A-Fa-f0-9]+)$/, ([, color]) => ({ 'background-color': color })],
  [/^bg-url-(.+)$/, ([, url]) => ({ 'background-image': `url(${url})` })],
  ['bg-cover', { 'background-size': 'cover' }],
  ['bg-contain', { 'background-size': 'contain' }],
  [
    /^bg-size-([\d\.]+)(\D*)/,
    ([, d, u]) => ({ 'background-size': `${d}${u || 'px'}` }),
  ],
  ['bg-repeat', { 'background-repeat': 'repeat' }],
  ['bg-norepeat', { 'background-repeat': 'no-repeat' }],
  ['bg-top', { 'background-position': 'top' }],
  ['bg-right', { 'background-position': 'right' }],
  ['bg-bottom', { 'background-position': 'bottom' }],
  ['bg-left', { 'background-position': 'left' }],
];

const transform = [
  [/^trans-x-(.+)$/, ([, d]) => ({ transform: `translateX(${d})` })],
];

const verticalMiddle = [
  ['middle', { 'vertical-align': 'middle' }],
  [
    'middle-out',
    {
      'text-align': 'center',
      'vertical-align': 'middle',
    },
  ],
  [
    'middle-before',
    {
      content: "''",
      display: 'inline-block',
      height: '100%',
      'vertical-align': 'middle',
    },
  ],
  [
    'middle-inner',
    {
      display: 'inline-block',
      'vertical-align': 'middle',
    },
  ],
];

const cursor = [
  ['cusor-pointer', { cursor: 'pointer' }],
  ['pointer', { cursor: 'pointer' }],
];

const icon = [
  [/^icon-fill-([A-z]+)$/, ([, color]) => ({ fill: `var(--${color})` })],
  [/^icon-fill-(#[A-Fa-f0-9]+)$/, ([, color]) => ({ fill: color })],
];

const overflow = [
  ['overflow-hidden', { overflow: 'hidden' }],
  ['overflow-auto', { overflow: 'auto' }],
  ['overflow-x-hidden', { 'overflow-x': 'hidden' }],
  ['overflow-y-hidden', { 'overflow-y': 'hidden' }],
  ['overflow-x-auto', { 'overflow-x': 'auto' }],
  ['overflow-y-auto', { 'overflow-y': 'auto' }],
];

const opacity = [/^opacity-([\d\.]+)$/, ([, d]) => ({ opacity: d })];

const filter = [
  /^filter-blur-([\d\.]+)(\D*)$/,
  ([, d, u]) => ({ filter: `blur(${d}${u || 'px'})` }),
];

const obj = [
  ['obj-cover', { ' object-fit': 'cover' }],
  ['obj-contain', { ' object-fit': 'contain' }],
];

export function presetTaiyuuki() {
  return {
    name: 'unocss-taiyuuki',
    theme: {
      colors: {},
      size: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
      },
      breakpoints: {
        sm: '599px',
        md: '768px',
        lg: '1024px',
      },
    },
    rules: [
      ...margin,
      ...padding,
      ...content,
      ...position,
      ...display,
      ...flex,
      ...text,
      ...border,
      ...background,
      ...transform,
      ...verticalMiddle,
      ...cursor,
      ...icon,
      ...overflow,
      ...line,
      ...shadow,
      ...obj,
      zIndex,
      opacity,
      filter,
      gap,
    ],
  };
}
