export const rgba = (color: string, opacity: number): string => {
    return color.replace('1)', opacity.toString() + ')');
}

export const isASCIIString = (str: string) => {
    const nonASCIIRegex = /[^\x00-\x7F]/;
    return !nonASCIIRegex.test(str);
}

export const convertIpfsToHttps = (ipfsLink: string) => {
    if (ipfsLink.startsWith("ipfs://")) {
        const ipfsHash = ipfsLink.slice(7);
        const httpsLink = `https://ipfs.io/ipfs/${ipfsHash}`;
        return httpsLink;
    } else {
        return ipfsLink;
    }
}

export const accessPropertyValue = (obj: Record<string, any>, path: string): any => {
    const keys = path.split('.');
    let currentObj: Record<string, any> | null = obj;

    for (const key of keys) {
        if (currentObj && currentObj.hasOwnProperty(key)) {
            currentObj = currentObj[key];
        } else {
            return null;
        }
    }

    return currentObj;
}