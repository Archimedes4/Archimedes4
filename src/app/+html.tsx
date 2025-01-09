/*
  Archimedes4 pulled from Pauly
  Andrew Mainella
  November 22 2023
  +html.tsx
  holds based html for web version. Used to add apple itunes meta tag.
*/
import React, { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="author" content="Andrew Mainella"/>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="manifest" href="/manifest.json" />
        <style type="text/css">{`
          body {
            overflow: hidden; /* Hide scrollbars */
            cursor: url(https://cdn.custom-cursor.com/db/15052/32/starter-northern-lights-cursor.png), pointer;
          }
          .pointer {
            cursor: url(https://cdn.custom-cursor.com/db/15051/32/starter-northern-lights-pointer.png), pointer;
          }
          .r-cursor-1loqt21 {
            cursor: url(https://cdn.custom-cursor.com/db/15051/32/starter-northern-lights-pointer.png), pointer !important;
          }
          .r-1otgn73 {
            cursor: url(https://cdn.custom-cursor.com/db/15051/32/starter-northern-lights-pointer.png), pointer !important;
          }
          .r-1loqt21 {
            cursor: url(https://cdn.custom-cursor.com/db/15051/32/starter-northern-lights-pointer.png), pointer !important;
          }
        `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}
