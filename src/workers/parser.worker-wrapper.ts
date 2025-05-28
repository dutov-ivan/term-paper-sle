import * as Comlink from "comlink";
import Worker from "./parser.worker.ts?worker";

export const parserWorker = Comlink.wrap<{
  parse(file: File): Promise<number[][]>;
}>(new Worker());
