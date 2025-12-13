import { dirname, join } from "path";
import { fileURLToPath } from "url";

const metaDir = dirname(import.meta.url);
const folder = join(fileURLToPath(metaDir), "..", "images");

export const ImagesFolder = {
    folder,
    file: (name) =>
        join(folder, name)
};