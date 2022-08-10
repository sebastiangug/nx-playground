import * as chalk from "chalk";

export const FormatLogContext = (name: string): string => {
  return chalk.bgHex("#07805a").bold.hex("#ffffff")(`[${name}]`);
};
