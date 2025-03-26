export const getBaseUrl = () => {
    if ((import.meta as any).env.DEV) return '';
    
    // Remove hash part and trailing slashes
    const url = window.location.href.split('#')[0].replace(/\/+$/, '');
    return url.substring(0, url.lastIndexOf('/vesting-wallet-claim') + '/vesting-wallet-claim'.length);
  };