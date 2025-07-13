import { themeQuartz } from "ag-grid-community";

export const lightTheme = themeQuartz.withParams({
  accentColor: "#087AD1",
  backgroundColor: "#FFFFFF",
  borderColor: "#D7E2E6",
  borderRadius: 2,
  browserColorScheme: "light",
  cellHorizontalPaddingScale: 0.7,
  chromeBackgroundColor: {
    ref: "backgroundColor",
  },
  columnBorder: false,
  fontFamily: {
    googleFont: "Inter",
  },
  fontSize: 13,
  foregroundColor: "#555B62",
  headerBackgroundColor: "#FFFFFF",
  headerFontSize: 13,
  headerFontWeight: 400,
  headerTextColor: "#84868B",
  rowBorder: true,
  rowVerticalPaddingScale: 0.8,
  sidePanelBorder: true,
  spacing: 6,
  wrapperBorder: false,
  wrapperBorderRadius: 2,
});

export const darkTheme = themeQuartz.withParams({
  accentColor: "#15BDE8",
  backgroundColor: "#0C0C0D",
  borderColor: "#ffffff00",
  borderRadius: 2,
  browserColorScheme: "dark",
  cellHorizontalPaddingScale: 0.7,
  chromeBackgroundColor: {
    ref: "backgroundColor",
  },
  columnBorder: false,
  fontFamily: {
    googleFont: "Roboto",
  },
  fontSize: 13,
  foregroundColor: "#BBBEC9",
  headerBackgroundColor: "#182226",
  headerFontSize: 13,
  headerFontWeight: 400,
  headerTextColor: "#FFFFFF",
  rowBorder: true,
  rowVerticalPaddingScale: 0.8,
  sidePanelBorder: true,
  spacing: 6,
  wrapperBorder: false,
  wrapperBorderRadius: 2,
});
