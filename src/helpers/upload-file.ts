import { api } from "@/api/axios";
import axios from "axios";

async function uploadThesis(
  file: File,
  onProgress: (percentCompleted: number) => void
) {
  const presignedUrl = await api.post("/theses/upload", {
    fileName: file.name,
  });

  await axios.put(presignedUrl.data.url, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        progressEvent.total
          ? (progressEvent.loaded * 100) / progressEvent.total
          : 0
      );
      onProgress(percentCompleted);
    },
  });

  return presignedUrl.data.key;
}

export { uploadThesis };
