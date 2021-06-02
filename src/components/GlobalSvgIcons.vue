<template>
  <div class="hide-base-svg">
    <svg xmlns="http://www.w3.org/2000/svg">
      <symbol id="add" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
      </symbol>
      <symbol id="add-color" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          fill="currentColor"
          d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
      </symbol>
      <symbol id="add-big" viewBox="0 0 48 48">
        <path d="M0 0h48v48H0z" fill="none" />
        <path
          fill="currentColor"
          d="M26 14h-4v8h-8v4h8v8h4v-8h8v-4h-8v-8zM24 4C12.96 4 4 12.96 4 24s8.96 20 20 20 20-8.96 20-20S35.04 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z"
        />
      </symbol>
      <symbol id="alert-outline" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
      </symbol>
      <symbol id="angle-arrow-down-white" viewBox="0 0 24 24">
        <path fill="#fff" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42z" />
      </symbol>
      <symbol id="angle-arrow-down" viewBox="0 0 24 24">
        <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42z" />
      </symbol>
      <symbol id="angle-arrow-up" viewBox="0 0 24 24">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
      </symbol>
      <symbol id="arrow-left" viewBox="0 0 24 24">
        <path fill="currentColor" d="M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z" />
      </symbol>
      <symbol id="arrow-right" viewBox="0 0 24 24">
        <path d="M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11H4z" />
      </symbol>
      <symbol id="book-open" viewBox="0 0 24 24">
        <path d="M13 12h7v1.5h-7m0-4h7V11h-7m0 3.5h7V16h-7m8-12H3a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 15h-9V6h9" />
      </symbol>
      <symbol id="calendar" viewBox="0 0 24 24">
        <path d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5v-5z" />
      </symbol>
      <symbol id="cash-multiple" viewBox="0 0 24 24">
        <path
          d="M5 6h18v12H5V6m9 3a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3M9 8a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2v-4a2 2 0 0 1-2-2H9m-8 2h2v10h16v2H1V10z"
        />
      </symbol>
      <symbol id="check-box-checked" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <path d="M0 0h24v24H0z" />
          <path
            fill="#1A1A1A"
            d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm12.293 4.293l-6.921 6.921-3.665-3.664-1.414 1.414 5.079 5.079 8.335-8.336-1.414-1.414z"
          />
        </g>
      </symbol>
      <symbol id="check-box-disabled" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <path d="M0 0h24v24H0z" />
          <rect width="16" height="16" x="4" y="4" fill="#F5F5F5" stroke="#BFBFBF" stroke-width="2" rx="2" />
        </g>
      </symbol>
      <symbol id="check-box-focus" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <path fill="#FEBB30" d="M0 0h24v24H0V0z" />
          <rect width="16" height="16" x="4" y="4" fill="#FFF" stroke="#1A1A1A" stroke-width="2" rx="2" />
        </g>
      </symbol>
      <symbol id="check-box-unchecked" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <path d="M0 0h24v24H0z" />
          <rect width="16" height="16" x="4" y="4" fill="#FFF" stroke="#1A1A1A" stroke-width="2" rx="2" />
        </g>
      </symbol>
      <symbol id="check-circle-outline" viewBox="0 0 24 24">
        <path
          d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8m-1 12.5L6.5 12l1.41-1.41L11 13.67l5.59-5.58L18 9.5l-7 7z"
        />
      </symbol>
      <symbol id="check" viewBox="0 0 24 24">
        <path d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z" />
      </symbol>
      <symbol id="checkbox-blank-outline" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5h14z" />
      </symbol>
      <symbol id="checkbox-marked" viewBox="0 0 24 24">
        <path d="M10 17l-5-5 1.41-1.42L10 14.17l7.59-7.59L19 8m0-5H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
      </symbol>
      <symbol id="chevron-left" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z" />
      </symbol>
      <symbol id="chevron-right" viewBox="0 0 24 24">
        <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
      </symbol>
      <symbol id="close-circle-outline" viewBox="0 0 24 24">
        <path
          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8z"
        />
      </symbol>
      <symbol id="close-circle" viewBox="0 0 24 24">
        <path
          d="M13.414 12l2.314-2.314-1.414-1.414L12 10.586 9.686 8.272 8.272 9.686 10.586 12l-2.31 2.31 1.413 1.415L12 13.415l2.31 2.31 1.415-1.414L13.415 12zM12 19a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
        />
      </symbol>
      <symbol id="close" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </symbol>
      <symbol id="close-currentColor" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </symbol>
      <symbol id="content-save" viewBox="0 0 24 24">
        <path
          d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4z"
        />
      </symbol>
      <symbol id="delete-outline" viewBox="0 0 24 24">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
        <path fill="none" d="M0 0h24v24H0V0z" />
      </symbol>
      <symbol id="delete-outline-color" viewBox="0 0 24 24">
        <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
        <path fill="none" d="M0 0h24v24H0V0z" />
      </symbol>
      <symbol id="delete" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z" />
      </symbol>
      <symbol id="dots-vertical" viewBox="0 0 24 24">
        <path
          d="M12 16a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2z"
        />
      </symbol>
      <symbol id="download" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"
        />
        <path fill="none" d="M0 0h24v24H0z" />
      </symbol>
      <symbol id="error" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8z"
        />
      </symbol>
      <symbol id="file-document-box" viewBox="0 0 24 24">
        <path
          d="M5 3c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2H5m0 2h14v14H5V5m2 2v2h10V7H7m0 4v2h10v-2H7m0 4v2h7v-2H7z"
        />
      </symbol>
      <symbol id="file" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <g>
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
        </g>
      </symbol>
      <symbol id="folder-multiple" viewBox="0 0 24 24">
        <path d="M22 4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6l2 2h8M2 6v14h18v2H2a2 2 0 0 1-2-2V6h2m4 0v10h16V6H6z" />
      </symbol>
      <symbol id="help" viewBox="0 0 24 24">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
        />
      </symbol>
      <symbol id="help-circle-outline" viewBox="0 0 24 24">
        <path
          d="M11 18h2v-2h-2v2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-14a4 4 0 0 0-4 4h2a2 2 0 0 1 2-2 2 2 0 0 1 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5a4 4 0 0 0-4-4z"
        />
      </symbol>
      <symbol id="info" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M11 7h2v2h-2zM11 11h2v6h-2z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </symbol>
      <symbol id="language" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
        />
      </symbol>
      <symbol id="magnify" viewBox="0 0 24 24">
        <path
          d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"
        />
      </symbol>
      <symbol id="menu-down" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5H7z" />
      </symbol>
      <symbol id="menu-down-disableable" viewBox="0 0 24 24">
        <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
      </symbol>
      <symbol id="menu-left" viewBox="0 0 24 24">
        <path d="M14 7l-5 5 5 5V7z" />
      </symbol>
      <symbol id="menu-right" viewBox="0 0 24 24">
        <path d="M10 17l5-5-5-5v10z" />
      </symbol>
      <symbol id="menu-up" viewBox="0 0 24 24">
        <path d="M7 15l5-5 5 5H7z" />
      </symbol>
      <symbol id="menu-up-disableable" viewBox="0 0 24 24">
        <path fill="currentColor" d="M7 15l5-5 5 5H7z" />
      </symbol>
      <symbol id="message" viewBox="0 0 24 24">
        <path d="M20 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h16M4 4v13.17L5.17 16H20V4H4m2 3h12v2H6V7m0 4h9v2H6v-2z" />
      </symbol>
      <symbol id="minus" viewBox="0 0 24 24">
        <path d="M19 13H5v-2h14v2z" />
      </symbol>
      <symbol id="minus-colored" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19 13H5v-2h14v2z" />
      </symbol>
      <symbol id="open-in-new" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z" />
      </symbol>
      <symbol id="pencil" viewBox="0 0 24 24">
        <path
          d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"
        />
      </symbol>
      <symbol id="pencil-outline" viewBox="0 0 24 24">
        <path
          d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z"
        />
      </symbol>
      <symbol id="pencil-outline-currentColor" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z"
        />
      </symbol>
      <symbol id="plus" viewBox="0 0 24 24">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </symbol>
      <symbol id="plus-colored" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </symbol>
      <symbol id="printer" viewBox="0 0 24 24">
        <path
          d="M18 3H6v4h12m1 5a1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1m-3 7H8v-5h8m3-6H5a3 3 0 0 0-3 3v6h4v4h12v-4h4v-6a3 3 0 0 0-3-3z"
        />
      </symbol>
      <symbol id="radio-disabled" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <path d="M0 0h24v24H0z" />
          <circle cx="12" cy="12" r="8" fill="#F5F5F5" stroke="#BFBFBF" stroke-width="2" />
        </g>
      </symbol>
      <symbol id="radio-focused" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <path d="M0 0h24v24H0z" />
          <circle cx="12" cy="12" r="8" fill="#FFF" stroke="#1A1A1A" stroke-linejoin="square" stroke-width="2" />
          <circle cx="12" cy="12" r="10.5" stroke="#FEBB30" stroke-width="3" />
        </g>
      </symbol>
      <symbol id="radio-marked" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <path d="M0 0h24v24H0z" />
          <g stroke-linejoin="square">
            <circle cx="12" cy="12" r="6.5" fill="#1A1A1A" stroke="#FFF" stroke-width="5" />
            <circle cx="12" cy="12" r="8" stroke="#1A1A1A" stroke-width="2" />
          </g>
        </g>
      </symbol>
      <symbol id="radio-unmarked" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <path d="M0 0h24v24H0z" />
          <circle cx="12" cy="12" r="8" fill="#FFF" stroke="#1A1A1A" stroke-width="2" />
        </g>
      </symbol>
      <symbol id="refresh" viewBox="0 0 24 24">
        <path
          d="M17.65 6.35A7.958 7.958 0 0 0 12 4a8 8 0 0 0-8 8 8 8 0 0 0 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18a6 6 0 0 1-6-6 6 6 0 0 1 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
        />
      </symbol>
      <symbol id="save" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
        />
      </symbol>
      <symbol id="settings" viewBox="0 0 24 24">
        <path
          d="M19.43 12.97l2.11 1.66c.19.15.24.42.12.64l-2 3.46c-.12.22-.39.3-.61.22l-2.49-1.01c-.52.4-1.06.73-1.69.99l-.37 2.65c-.04.24-.25.42-.5.42h-4c-.25 0-.46-.18-.5-.42l-.37-2.65c-.63-.25-1.17-.59-1.69-.99l-2.49 1.01c-.22.08-.49 0-.61-.22l-2-3.46a.493.493 0 0 1 .12-.64l2.11-1.66L4.5 12l.07-1-2.11-1.63a.493.493 0 0 1-.12-.64l2-3.46c.12-.22.39-.31.61-.22l2.49 1c.52-.39 1.06-.73 1.69-.98l.37-2.65c.04-.24.25-.42.5-.42h4c.25 0 .46.18.5.42l.37 2.65c.63.25 1.17.59 1.69.98l2.49-1c.22-.09.49 0 .61.22l2 3.46c.12.22.07.49-.12.64L19.43 11l.07 1-.07.97M6.5 12c0 .58.09 1.13.25 1.66l-2.07 1.7.75 1.3 2.52-.94c.74.81 1.73 1.4 2.85 1.65l.44 2.63h1.5l.44-2.63c1.12-.24 2.12-.83 2.87-1.64l2.51.94.75-1.3-2.07-1.7c.17-.53.26-1.09.26-1.67 0-.57-.09-1.13-.25-1.65l2.06-1.69-.75-1.3-2.5.93a5.526 5.526 0 0 0-2.87-1.66L12.75 4h-1.5l-.44 2.63c-1.12.25-2.12.84-2.87 1.66l-2.5-.94-.75 1.3 2.06 1.7c-.16.52-.25 1.08-.25 1.65M12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5m0 2a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5 1.5 1.5 0 0 0-1.5-1.5z"
        />
      </symbol>
      <symbol id="sort-acending" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <path d="M0 0h24v24H0z" />
          <path fill="#1A1A1A" d="M6 13l6 6 6-6z" />
          <path stroke="#1A1A1A" d="M16.793 10.5L12 5.707 7.207 10.5h9.586z" />
        </g>
      </symbol>
      <symbol id="sort-descending" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <path d="M0 0h24v24H0z" />
          <path stroke="#1A1A1A" d="M7.207 13.5L12 18.293l4.793-4.793H7.207z" />
          <path fill="#1A1A1A" d="M18 11l-6-6-6 6z" />
        </g>
      </symbol>
      <symbol id="sort-none" viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd">
          <path d="M0 0h24v24H0z" />
          <path d="M7.207 13.5L12 18.293l4.793-4.793H7.207zm9.586-3L12 5.707 7.207 10.5h9.586z" stroke="#1A1A1A" />
        </g>
      </symbol>
      <symbol id="success" viewBox="0 0 24 24">
        <path
          d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8m-1 12.5L6.5 12l1.41-1.41L11 13.67l5.59-5.58L18 9.5l-7 7z"
        />
      </symbol>
      <symbol id="warning" viewBox="0 0 24 24">
        <path d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
      </symbol>
      <symbol id="lightbulb-outline" viewBox="0 0 24 24">
        <path
          d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z"
        />
      </symbol>
      <symbol id="paere" viewBox="0 0 24 24">
        <path
          d="M12 3C11.54 3 11.07 3.04 10.6 3.14C7.84 3.67 5.64 5.9 5.12 8.66C4.64 11.27 5.6 13.67 7.34 15.22C7.77 15.6 8 16.13 8 16.69V19C8 20.1 8.9 21 10 21H10.28C10.63 21.6 11.26 22 12 22C12.74 22 13.38 21.6 13.72 21H14C15.1 21 16 20.1 16 19V16.69C16 16.14 16.22 15.6 16.64 15.23C18.09 13.95 19 12.08 19 10C19 6.13 15.87 3 12 3ZM14 17H10V16H14V17ZM10 19V18H14V19H10ZM15.31 13.74C15.22 13.82 15.15 13.92 15.07 14H8.92C8.84 13.91 8.77 13.81 8.68 13.73C7.36 12.55 6.77 10.79 7.09 9.03C7.45 7.09 9.04999 5.48 10.98 5.1C11.32 5.03 11.66 5 12 5C14.76 5 17 7.24 17 10C17 11.43 16.39 12.79 15.31 13.74Z"
          fill="white"
        />
        <path d="M12.5 11H11.5V14H12.5V11Z" fill="white" />
        <path d="M10.3795 8.87372L9.67239 9.58082L11.7937 11.7021L12.5008 10.995L10.3795 8.87372Z" fill="white" />
        <path d="M11.501 11.0052L12.2081 11.7123L14.3294 9.59098L13.6223 8.88388L11.501 11.0052Z" fill="white" />
      </symbol>
      <symbol id="knap" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M13 5c2.21 0 4 1.79 4 4 0 1.5-.8 2.77-2 3.46v-1.22c.61-.55 1-1.35 1-2.24 0-1.66-1.34-3-3-3s-3 1.34-3 3c0 .89.39 1.69 1 2.24v1.22C9.8 11.77 9 10.5 9 9c0-2.21 1.79-4 4-4zm7 15.5c-.03.82-.68 1.47-1.5 1.5H13c-.38 0-.74-.15-1-.43l-4-4.2.74-.77c.19-.21.46-.32.76-.32h.2L12 18V9c0-.55.45-1 1-1s1 .45 1 1v4.47l1.21.13 3.94 2.19c.53.24.85.77.85 1.35v3.36zM20 2H4c-1.1 0-2 .9-2 2v8c0 1.11.9 2 2 2h4v-2H4V4h16v8h-2v2h2v-.04l.04.04c1.09 0 1.96-.91 1.96-2V4c0-1.1-.89-2-2-2z"
        />
      </symbol>
      <symbol id="billede" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19 5v14H5V5h14zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"
        />
      </symbol>
      <symbol id="richtext" viewBox="0 0 24 24">
        <path fill="currentColor" d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z" />
      </symbol>
      <symbol id="video" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
      </symbol>
      <symbol id="accordion" viewBox="0 0 24 24">
        <path fill="currentColor" d="M4 12h16v2H4v-2zm0-3h16v2H4V9zm12-5l-4 4-4-4h3V1h2v3h3zM8 19l4-4 4 4h-3v3h-2v-3H8z" />
      </symbol>
      <symbol id="liste" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"
        />
      </symbol>
      <symbol id="card" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 15h-2v-2h2v2zm6 0h-4v-2h4v2zM8 11H6V9h2v2zm10 0h-8V9h8v2zm2 9H4c-.53 0-1.04-.21-1.414-.586C2.21 19.04 2 18.53 2 18V6c0-.53.21-1.04.586-1.414C2.96 4.21 3.47 4 4 4h16c.53 0 1.04.21 1.414.586C21.79 4.96 22 5.47 22 6v12c0 .53-.21 1.04-.586 1.414C21.04 19.79 20.53 20 20 20zM4 6v12h16V6H4z"
        />
      </symbol>
      <symbol id="listecard" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7zm-4 6h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
        />
      </symbol>
      <symbol id="infobox" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
      </symbol>
      <symbol id="loading" viewBox="0 0 24 24">
        <path
          fill="#fff"
          d="M12 4V2c-1.313 0-2.614.259-3.827.761-1.213.503-2.315 1.24-3.244 2.168C3.054 6.804 2 9.348 2 12h2c0-2.122.843-4.157 2.343-5.657S9.878 4 12 4z"
        />
      </symbol>
      <symbol id="loading-current-color" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 4V2c-1.313 0-2.614.259-3.827.761-1.213.503-2.315 1.24-3.244 2.168C3.054 6.804 2 9.348 2 12h2c0-2.122.843-4.157 2.343-5.657S9.878 4 12 4z"
        />
      </symbol>
      <symbol id="remove-red-eye-outline" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 6.5c3.79 0 7.17 2.13 8.82 5.5-1.65 3.37-5.02 5.5-8.82 5.5S4.83 15.37 3.18 12C4.83 8.63 8.21 6.5 12 6.5m0-2C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5m0-2c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5z"
        />
      </symbol>
      <symbol id="afpub" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M14.46 15.88L15.88 14.46L18 16.59L20.12 14.46L21.54 15.88L19.41 18L21.54 20.12L20.12 21.54L18 19.41L15.88 21.54L14.46 20.12L16.59 18L14.46 15.88ZM5 3H19C20.11 3 21 3.89 21 5V12.8C20.39 12.45 19.72 12.2 19 12.08V5H5V19H12.08C12.2 19.72 12.45 20.39 12.8 21H5C3.89 21 3 20.11 3 19V5C3 3.89 3.89 3 5 3ZM7 7H17V9H7V7ZM7 11H17V12.08C16.15 12.22 15.37 12.54 14.68 13H7V11ZM7 15H12V17H7V15Z"
        />
      </symbol>
      <symbol id="kopi" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM15 5H8C6.9 5 6.01 5.9 6.01 7L6 21C6 22.1 6.89 23 7.99 23H19C20.1 23 21 22.1 21 21V11L15 5ZM8 21V7H14V12H19V21H8Z"
        />
      </symbol>
      <symbol id="slet" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"
        />
      </symbol>
      <symbol id="hero" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M5 11h8v6H5v-6zm2 4h4v-2H7v2zM3 3h18c1.1 0 2 .88 2 1.98V19c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V4.98C1 3.88 1.9 3 3 3zm0 16.02h18V4.97H3v14.05z"
        />
      </symbol>
      <symbol id="location" viewBox="0 0 24 24">
        <path
          fill="#000"
          d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z"
        />
      </symbol>
      <symbol id="tag" viewBox="0 0 24 24">
        <path
          fill="#000"
          d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z"
        />
        <path fill="#000" d="M6.5 8C7.328 8 8 7.328 8 6.5S7.328 5 6.5 5 5 5.672 5 6.5 5.672 8 6.5 8z" />
      </symbol>
      <symbol id="teaser" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM3 19V6h8v13H3zm18 0h-8V6h8v13zm-7-9.5h6V11h-6V9.5zm0 2.5h6v1.5h-6V12zm0 2.5h6V16h-6v-1.5z"
        />
      </symbol>
      <symbol id="emnemenu" viewBox="0 0 24 24">
        <path fill="#000" d="M21 13h-8v2h8v-2zm0 4h-8v2h8v-2zm0-8h-8v2h8V9zm0-4h-8v2h8V5zM11 13H3v2h8v-2zm0 4H3v2h8v-2zm0-8H3v2h8V9zm0-4H3v2h8V5z" />
      </symbol>
      <symbol id="udvidedeCardgruppe" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19 16v2h-4v-2h4zM9 4v6H5V4h4zm10 0v6h-4V4h4zM9 16v2H5v-2h4zm12-2h-8v6h8v-6zM11 2H3v10h8V2zm10 0h-8v10h8V2zM11 14H3v6h8v-6z"
        />
      </symbol>
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class GlobalSvgIcons extends Vue {}
</script>

<style scoped lang="scss"></style>
