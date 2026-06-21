// src/types/global.d.ts
import React from 'react';

declare global {
  namespace JSX {
    type Element = React.ReactElement;
    type ElementClass = React.Component;
    interface IntrinsicElements {
      [elemName: string]: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export {};