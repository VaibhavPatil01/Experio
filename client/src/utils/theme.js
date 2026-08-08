export const hexToRgb = (hex) => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 166, b: 62 }; // default green
};

export const mixColors = (hex1, hex2, weight) => {
  let c1 = hexToRgb(hex1);
  let c2 = hexToRgb(hex2);
  let r = Math.round(c1.r * weight + c2.r * (1 - weight));
  let g = Math.round(c1.g * weight + c2.g * (1 - weight));
  let b = Math.round(c1.b * weight + c2.b * (1 - weight));
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
};

export const applyThemeColor = (colorValue) => {
  let colorHex = colorValue;
  let dullColorHex, bannerStart, bannerEnd, heroGradStart, heroGradEnd;

  if (colorValue === 'green') {
    colorHex = '#00a63e';
    bannerStart = '#ABFF7E';
    bannerEnd = '#FDFEFF';
  } else if (colorValue === 'darkblue') {
    colorHex = '#002E7D';
    bannerStart = '#60a5fa';
    bannerEnd = '#eff6ff';
  } else {
    // Generate derived colors from custom hex
    bannerStart = mixColors(colorHex, '#ffffff', 0.5);
    bannerEnd = mixColors(colorHex, '#ffffff', 0.05);
  }

  // Uniformly generate a dark-to-light gradient from the base primary color
  heroGradStart = mixColors(colorHex, '#000000', 0.6); // 60% color, 40% black
  heroGradEnd = mixColors(colorHex, '#ffffff', 0.7);   // 70% color, 30% white

  document.documentElement.style.setProperty('--color-primary', colorHex);
  document.documentElement.style.setProperty('--color-banner-start', bannerStart);
  document.documentElement.style.setProperty('--color-banner-end', bannerEnd);
  document.documentElement.style.setProperty('--color-hero-grad-start', heroGradStart);
  document.documentElement.style.setProperty('--color-hero-grad-end', heroGradEnd);

  updateFavicon(colorHex);
};

const updateFavicon = (colorHex) => {
  const svgTemplate = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="192" height="192">
<path d="M0 0 C63.36 0 126.72 0 192 0 C192 63.36 192 126.72 192 192 C128.64 192 65.28 192 0 192 C0 128.64 0 65.28 0 0 Z " fill="${colorHex}" transform="translate(0,0)"/>
<path d="M0 0 C24.75 0 49.5 0 75 0 C75 4.62 75 9.24 75 14 C55.2 14 35.4 14 15 14 C15 25.55 15 37.1 15 49 C33.48 49 51.96 49 71 49 C71 53.62 71 58.24 71 63 C52.85 63 34.7 63 16 63 C16 75.21 16 87.42 16 100 C35.8 100 55.6 100 76 100 C76 104.62 76 109.24 76 114 C50.92 114 25.84 114 0 114 C0 76.38 0 38.76 0 0 Z " fill="#F9FCFE" transform="translate(58,39)"/>
<path d="M0 0 C0.33 0.66 0.66 1.32 1 2 C1.66 2 2.32 2 3 2 C3 2.99 3 3.98 3 5 C3.99 5.33 4.98 5.66 6 6 C6 6.66 6 7.32 6 8 C6.99 8 7.98 8 9 8 C9 8.66 9 9.32 9 10 C9.66 10.33 10.32 10.66 11 11 C7.37 11 3.74 11 0 11 C0 7.37 0 3.74 0 0 Z " fill="#000000" transform="translate(0,181)"/>
<path d="M0 0 C0.33 0 0.66 0 1 0 C1 3.63 1 7.26 1 11 C-2.63 11 -6.26 11 -10 11 C-9.34 10.67 -8.68 10.34 -8 10 C-8 9.34 -8 8.68 -8 8 C-7.01 8 -6.02 8 -5 8 C-4.67 7.01 -4.34 6.02 -4 5 C-3.34 5 -2.68 5 -2 5 C-2 4.01 -2 3.02 -2 2 C-1.34 2 -0.68 2 0 2 C0 1.34 0 0.68 0 0 Z " fill="#000000" transform="translate(191,181)"/>
<path d="M0 0 C3.63 0 7.26 0 11 0 C11 3.63 11 7.26 11 11 C10.67 10.34 10.34 9.68 10 9 C9.34 9 8.68 9 8 9 C8 8.01 8 7.02 8 6 C7.01 5.67 6.02 5.34 5 5 C5 4.34 5 3.68 5 3 C2.525 2.01 2.525 2.01 0 1 C0 0.67 0 0.34 0 0 Z " fill="#000000" transform="translate(181,0)"/>
<path d="M0 0 C3.63 0 7.26 0 11 0 C9.515 1.485 9.515 1.485 8 3 C7.34 3 6.68 3 6 3 C5.67 3.99 5.34 4.98 5 6 C4.34 6 3.68 6 3 6 C3 6.99 3 7.98 3 9 C2.34 9 1.68 9 1 9 C0.67 9.66 0.34 10.32 0 11 C0 7.37 0 3.74 0 0 Z " fill="#000000" transform="translate(0,0)"/>
</svg>`;

  const blob = new Blob([svgTemplate], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  let link = document.getElementById('dynamic-favicon');
  if (!link) {
    link = document.createElement('link');
    link.id = 'dynamic-favicon';
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    
    // Replace all default static favicons to ensure the dynamic one takes precedence
    const defaultFavicons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
    defaultFavicons.forEach(el => {
      if (el.id !== 'dynamic-favicon') {
        el.remove();
      }
    });
    
    document.head.appendChild(link);
  }
  link.href = url;
};
