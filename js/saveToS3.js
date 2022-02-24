import md5 from "https://cdn.skypack.dev/md5";
import { getURLPath } from "./getURLPath.js";

export async function saveToS3(content) {
  const uniqueID = md5(JSON.stringify(content));
  const { exists, uploadURL, jsonFilename, id } = await fetch(
    `https://vt4x133ukg.execute-api.eu-west-1.amazonaws.com/default/getPresignedURL?id=${uniqueID}`
  ).then((r) => r.json());
  if (!exists) {
    await fetch(uploadURL, {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: content,
    });
  }

  const link = getURLPath(`?id=${id}`);

  return link;
}