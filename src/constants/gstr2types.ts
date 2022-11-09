export const gstr2Types: {
  [key: string]: { platform: string; type: string };
} = {
  "GSTR - 2B (B2B)": { platform: "Gstr2B", type: "b2b" },
  "GSTR - 2B (B2BA)": { platform: "Gstr2B", type: "b2ba" },
  "GSTR - 2B (CDN)": { platform: "Gstr2B", type: "cdnr" },
  "GSTR - 2B (CDNRA)": { platform: "Gstr2B", type: "cdnra" },
  "GSTR - 2B (IMG)": { platform: "Gstr2B", type: "img" },
  "GSTR - 2B (IMGSEZ)": { platform: "Gstr2B", type: "imgsez" },
  "GSTR - 2A (B2B)": { platform: "Gstr2A", type: "b2b" },
  "GSTR - 2A (B2BA)": { platform: "Gstr2A", type: "b2ba" },
  "GSTR - 2A (CDN)": { platform: "Gstr2A", type: "cdnr" },
  "GSTR - 2A (CDNRA)": { platform: "Gstr2A", type: "cdnra" },
  "GSTR - 2A (IMG)": { platform: "Gstr2A", type: "img" },
  "GSTR - 2A (IMGSEZ)": { platform: "Gstr2A", type: "imgsez" },
  "GSTR - 2A (TCS)": { platform: "Gstr2A", type: "tcs" },
  "GSTR - 2A (TDS)": { platform: "Gstr2A", type: "tds" },
  "GSTR - 2A (TDSA)": { platform: "Gstr2A", type: "tdsa" }
};

export const gstr2TypesApi: { [key: string]: any } = {
  "2a": {
    cdnr: "GSTR - 2A (CDN)",
    b2b: "GSTR - 2A (B2B)"
  },
  "2b": {
    b2b: "GSTR - 2B (B2B)",
    b2ba: "GSTR - 2B (B2BA)",
    cdnr: "GSTR - 2B (CDN)"
  }
};
