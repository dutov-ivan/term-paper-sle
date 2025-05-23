import Papa from "papaparse";

self.onmessage = (e: MessageEvent<File>) => {
  const file = e.data;

  Papa.parse(file, {
    header: false,
    skipEmptyLines: true,
    complete: (results) => {
      const data: number[][] = (results.data as string[][]).map((row) =>
        row.map((cell) => parseFloat(cell))
      );

      self.postMessage({ success: true, data });
    },
    error: (err) => {
      self.postMessage({ success: false, error: err.message });
    },
  });
};

export {};
