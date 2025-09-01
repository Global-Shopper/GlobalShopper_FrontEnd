const TAX_TYPE = [
    {ACFTA: "Hiệp định Khu vực Mậu dịch Tự do ASEAN - Trung Quốc (ACFTA)" },
    {AJCEP: "Hiệp định Đối tác Kinh tế Toàn diện ASEAN - Nhật Bản (AJCEP)" },
    {AKFTA: "Hiệp định Thương mại Tự do ASEAN - Hàn Quốc (AKFTA)" },
    {CPTPP: "Hiệp định Đối tác Toàn diện và Tiến bộ xuyên Thái Bình Dương (CPTPP)" },
    {MFN: "Thuế nhập khẩu tối huệ quốc (MFN – Most Favoured Nation)" },
    {RCEPT: "Hiệp định Đối tác Kinh tế Toàn diện Khu vực (RCEP)" },
    {TTDB: "Thuế Tiêu thụ đặc biệt (TTĐB)" },
    {UKVFTA: "Hiệp định Thương mại Tự do Việt Nam - Vương quốc Anh (UKVFTA)" },
    {VAT: "Thuế Giá trị gia tăng (VAT)" },
    {VJEPA: "Hiệp định Đối tác Kinh tế Việt Nam - Nhật Bản (VJEPA)" },
    {VKFTA: "Hiệp định Thương mại Tự do Việt Nam - Hàn Quốc (VKFTA)" },
]

// Normalized tax types and region mapping for cleaner usage across the app
export const TAX_TYPE_ENTRIES = (TAX_TYPE || []).flatMap((obj) => Object.entries(obj || {}));
export const TAX_TYPE_MAP = Object.fromEntries(TAX_TYPE_ENTRIES);
export const TAX_TYPE_CODES = TAX_TYPE_ENTRIES.map(([code]) => code);

// Supported region codes
export const REGION_CODES = ["US", "UK", "JP", "KR", "CHN"];

// Mapping from region -> allowed tax type codes
export const REGION_TAX_TYPES = {
  US: ["MFN", "VAT", "TTDB"],
  UK: ["MFN", "UKVFTA", "VAT", "TTDB"],
  JP: ["MFN", "VJEPA", "AJCEP", "CPTPP", "VAT", "TTDB"],
  KR: ["MFN", "VKFTA", "AKFTA", "CPTPP", "VAT", "TTDB"],
  CHN: ["MFN", "ACFTA", "RCEPT", "CPTPP", "VAT", "TTDB"],
};

export const getTaxTypeLabel = (code) => TAX_TYPE_MAP?.[code] || "";

// Given a tax type code, return regions that support it. If empty/unknown, return all regions.
export const getRegionsByTaxType = (taxTypeCode) => {
  if (!taxTypeCode) return REGION_CODES;
  return REGION_CODES.filter((region) => (REGION_TAX_TYPES[region] || []).includes(taxTypeCode));
};

// Given a region code, return allowed tax type codes
export const getTaxTypesByRegion = (region) => REGION_TAX_TYPES?.[region] || [];