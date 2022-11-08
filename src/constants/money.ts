
/**
 * Converts number into dallors format
 * 
 * @param value 
 * @returns {String} - '$1.29' 
*/
export const numToMoney = (value: number): string => `$${value/100}`