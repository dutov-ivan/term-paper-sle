import { expose } from "comlink";
import Papa from "papaparse";

const parser = {
  async parse(file: File): Promise<number[][]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const data: number[][] = (results.data as string[][]).map((row) =>
              row.map((cell) => parseFloat(cell))
            );
            if (data.length !== data[0].length - 1) {
              reject(new Error("Invalid matrix format"));
              return;
            }
            resolve(data);
          } catch (err) {
            reject((err as Error).message);
          }
        },
        error: (err) => {
          reject(err.message);
        },
      });
    });
  },
};

expose(parser);
