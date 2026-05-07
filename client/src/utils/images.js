import api from "../api/axiosInstance";

const apiOrigin = (() => {
  try {
    return new URL(api.defaults.baseURL).origin;
  } catch {
    return "";
  }
})();

export const getImageUrl = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;

  const normalized = image.replaceAll("\\", "/").replace(/^public\//, "");
  if (normalized.startsWith("/images/")) return `${apiOrigin}${normalized}`;
  if (normalized.startsWith("images/")) return `${apiOrigin}/${normalized}`;

  return image;
};

export const getEditableImageUrl = (image) => {
  const imageUrl = getImageUrl(image);
  return /^https?:\/\//i.test(imageUrl) ? imageUrl : "";
};

export const getFallbackImage = (label = "Product") => {
  const safeLabel = String(label)
    .slice(0, 32)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#f8fafc"/>
          <stop offset="1" stop-color="#ccfbf1"/>
        </linearGradient>
      </defs>
      <rect width="900" height="900" fill="url(#bg)"/>
      <rect x="170" y="230" width="560" height="420" rx="36" fill="#ffffff" stroke="#0f172a" stroke-width="18"/>
      <path d="M280 340h340M280 430h250M280 520h180" stroke="#0f766e" stroke-width="26" stroke-linecap="round"/>
      <circle cx="665" cy="620" r="42" fill="#0f172a"/>
      <text x="450" y="760" text-anchor="middle" font-family="Arial, sans-serif" font-size="46" font-weight="800" fill="#0f172a">${safeLabel}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
