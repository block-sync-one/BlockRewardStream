import { useConnection } from "@solana/wallet-adapter-react";
declare global {

    interface Number {
      toFixedNoRounding: Function;
    }
  }
  Number.prototype.toFixedNoRounding = function (n: number) {
    const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
    const a: any = this.toString().match(reg)?.[0];
    const dot = a.indexOf(".");
    if (dot === -1) { // integer, insert decimal dot and pad up zeros
      return a + "." + "0".repeat(n);
    }
    const b = n - (a.length - dot) + 1;
    return b > 0 ? (a + "0".repeat(b)) : a;
  }
  
  
// number utils  
export const fixedNumber = (value: any): string => {
    // Convert the input to a number
    const num = Number(value);

    // If the number is not valid, return '0.00'
    if (isNaN(num) || !isFinite(num)) {
      return '0.00';
    }

    // Find the closest positive number
    const absNum = Math.abs(num);

    // Find the minimum number of decimal places needed
    let decimalPlaces = 4; // Start with minimum 2 decimal places
    let tempNum = absNum;
    while (tempNum < 0.01 && tempNum > 0) {
      tempNum *= 10;
      decimalPlaces++;
    }

    // Cap the decimal places at 8 to avoid excessive precision
    decimalPlaces = Math.min(decimalPlaces, 8);

    // Format the number with the calculated decimal places
    const formattedNum = absNum.toFixedNoRounding(decimalPlaces);

    // Remove trailing zeros after the decimal point, but keep at least 2 decimal places
    const trimmedNum = parseFloat(formattedNum).toFixedNoRounding(Math.max(2, (formattedNum.split('.')[1] || '').replace(/0+$/, '').length));

    // Localize the number
    return Number(trimmedNum).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
}
export const formatScientificToDecimal = (num: any): string => {
    // Convert to string and check if it's in scientific notation
    const numStr = num.toString();
    if (numStr.includes('e')) {
      // Convert scientific notation to decimal
      const res = Number(num).toFixed(20).replace(/\.?0+$/, '');
      return res
    }
    return numStr;
}
export const formatBigNumbers = (n: number, decimals = 2) => {
    if (n < 1e3) return n.toFixedNoRounding(decimals);
    if (n >= 1e3 && n < 1e6) return Math.floor(n / 1e3 * 10) / 10 + "K";
    if (n >= 1e6 && n < 1e9) return Math.floor(n / 1e6 * 10) / 10 + "M";
    if (n >= 1e9 && n < 1e12) return Math.floor(n / 1e9 * 10) / 10 + "B";
    if (n >= 1e12) return Math.floor(n / 1e12 * 10) / 10 + "T";
    return n;
};

export const getBlockReward = async () => {
  const { connection } = useConnection();
  const latestBlock = await connection.getSlot();
  const block = await connection.getBlock(latestBlock);
  
  console.log(block); 
}
