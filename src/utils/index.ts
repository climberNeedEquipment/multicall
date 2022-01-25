
/**
 * Takes an array of any length and separates the values into separate arrays of the length provided.
 * 
 * @param arr Array of values to chunk
 * @param len Max length to max each chunk (the final array will likely be lower than this len)
 * @returns any[][]
 */
export function chunkArray<T>(arr: T[], len: number): T[][] {
    const chunks = [];
    const n = arr.length;
    let i = 0;

    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }

    return chunks;
}