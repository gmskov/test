import config from "../config";

export function isProduction() {
  return config.MODE === 'production';
}
