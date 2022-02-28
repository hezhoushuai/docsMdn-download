import url from "url";
import path from "path";

export default (url2) => {
  const __filename = url.fileURLToPath(url2);
  const __dirname = path.dirname(__filename);

  return { __filename, __dirname };
};
