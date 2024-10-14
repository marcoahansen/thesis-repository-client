import { api } from "@/api/axios";
import axios from "axios";

async function uploadThesis(file: File) {
  const presignedUrl = await api.post("/theses/upload", {
    fileName: file.name,
  });
  await axios.put(presignedUrl.data.url, file, {
    headers: { "Content-Type": file.type },
  });
  return presignedUrl.data.key;
}

export { uploadThesis };
