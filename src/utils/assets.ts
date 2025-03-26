import { getBaseUrl } from './urls';

export const getAssetPath = (assetPath: string): string => {
  const baseUrl = getBaseUrl();
  console.log('Asset URL:', `${baseUrl}${assetPath}`); // Debug log
  return `${baseUrl}${assetPath}`;
};