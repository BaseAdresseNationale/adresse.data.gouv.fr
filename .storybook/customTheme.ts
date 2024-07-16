import { create } from "@storybook/theming";

const brandImage = "logo.png";
const brandTitle = "@inseefr/lunatic-dsfr";
const brandUrl = "https://github.com/inseefr/Lunatic-dsfr";
const fontBase = '"Marianne", arial, sans-serif';
const fontCode = "monospace";

/**
 * Dark theme configuration for Storybook.
 *
 * @see For possible values that can be overridden, refer to:
 * {@link https://github.com/storybookjs/storybook/blob/fd6a748190f09d9fee906357daaead829ca4243f/code/lib/theming/src/types.ts|Storybook Theming Types}
 *
 */
export const darkTheme = create({
  base: "dark",
  appBg: "#1E1E1E",
  appContentBg: "#161616",
  appPreviewBg: "#161616",
  barBg: "#1E1E1E",
  colorSecondary: "#8585F6",
  textColor: "#FFFFFF",
  brandImage,
  brandTitle,
  brandUrl,
  fontBase,
  fontCode,
});

/**
 * Light theme configuration for Storybook.
 *
 * @see For possible values that can be overridden, refer to:
 * {@link https://github.com/storybookjs/storybook/blob/fd6a748190f09d9fee906357daaead829ca4243f/code/lib/theming/src/types.ts|Storybook Theming Types}
 *
 */
export const lightTheme = create({
  base: "light",
  appBg: "#F6F6F6",
  appContentBg: "#FFFFFF",
  appPreviewBg: "#FFFFFF",
  barBg: "#FFFFFF",
  colorSecondary: "#000091",
  textColor: "#212121",
  brandImage,
  brandTitle,
  brandUrl,
  fontBase,
  fontCode,
});
