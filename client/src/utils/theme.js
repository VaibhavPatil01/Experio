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
    dullColorHex = '#dcfce7';
    bannerStart = '#ABFF7E';
    bannerEnd = '#FDFEFF';
    heroGradStart = '#15803d';
    heroGradEnd = '#22c55e';
  } else if (colorValue === 'darkblue') {
    colorHex = '#002E7D';
    dullColorHex = '#347df8';
    bannerStart = '#60a5fa';
    bannerEnd = '#eff6ff';
    heroGradStart = '#001a47';
    heroGradEnd = '#0040ad';
  } else {
    // Generate derived colors from custom hex
    dullColorHex = mixColors(colorHex, '#ffffff', 0.2); 
    bannerStart = mixColors(colorHex, '#ffffff', 0.5);
    bannerEnd = mixColors(colorHex, '#ffffff', 0.05);
    heroGradStart = mixColors(colorHex, '#000000', 0.8);
    heroGradEnd = colorHex;
  }

  document.documentElement.style.setProperty('--color-primary', colorHex);
  document.documentElement.style.setProperty('--color-primary-dull', dullColorHex);
  document.documentElement.style.setProperty('--color-banner-start', bannerStart);
  document.documentElement.style.setProperty('--color-banner-end', bannerEnd);
  document.documentElement.style.setProperty('--color-hero-grad-start', heroGradStart);
  document.documentElement.style.setProperty('--color-hero-grad-end', heroGradEnd);
};
