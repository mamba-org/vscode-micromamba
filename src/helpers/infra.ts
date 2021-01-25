export const isWindows = process.platform === 'win32';
export const pathKey = Object.keys(process.env).find((x) => x.toUpperCase() === 'PATH') || '';
