import { keccak } from "ethereumjs-util";
import screenNameGenerator from "docker-names";

export const setScreenName = (screenName: string, chainId: string) =>
  localStorage.setItem(`demo/${chainId}/thisScreenName`, screenName);

export const getScreenName = (chainId: string) =>
  localStorage.getItem(`demo/${chainId}/thisScreenName`);

export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

export const generateScreenName = () => {
  const regex = /(\w+)_(\w+)/gi;
  const replaceFn = (tokn: any, $1: any, $2: any) =>
    capitalize($1) + " " + capitalize($2);
  return screenNameGenerator.getRandomName().replace(regex, replaceFn);
};

export const getZkTokenName = (token: string | number) => {
  const result = /ZkAssetTradeable-deploy(.+)/.exec(String(token));
  if (result) {
    return result[1];
  }
  throw Error("Couldn't retreive token name");
};

const solarizedColors = [
  "#AF1500", // redbrown
  "#AF9E00", // midyellow
  "#00AF5B", // green
  "#0066AF", // cadetblue
  "#4D00AF", // purple
  "#AF005E" // jazzberry
];

export const getColor = (value: string) => {
  const byte = Number(keccak(value)[0]);
  return solarizedColors[byte % solarizedColors.length];
};

// for .reduce fn
export function getSum(sum: any, note: any): any {
  return sum + parseInt(note.k.toString());
}
