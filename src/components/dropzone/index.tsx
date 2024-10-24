import { useDropzone } from "react-dropzone";
import { ChangeEventHandler, FC, useCallback } from "react";
import { FileIcon, FileUp, X } from "lucide-react";

interface HasFileProps {
  file?: File;
  removeFile?: () => void;
}

const Dropzone: FC<{
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = ({ onChange, ...rest }) => {
  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onChange?.({
          target: {
            files: [file],
          },
        } as any);
      }
    },
    [onChange]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...rest,
  });

  return (
    <div
      className={`${
        isDragActive
          ? "border border-[#2B92EC] bg-[#EDF2FF]"
          : "border-dashed border-[#e0e0e0]"
      } flex items-center justify-center mx-auto text-center border-2 rounded-md mt-1 pt-3 pb-1 transition-all cursor-pointer hover:bg-[#EDF2FF] `}
      {...getRootProps()}
    >
      <div className="flex-1 flex flex-col">
        <div className="mx-auto text-gray-400 mb-2">
          <FileUp color="#4070f4" size={18} />
        </div>
        <div className="text-[12px] font-normal text-gray-500">
          <span className="text-[#4070f4] cursor-pointer" onClick={() => {}}>
            Clique aqui
          </span>{" "}
          para selecionar um arquivo ou arraste e solte
        </div>
        <input
          {...getInputProps({ onChange })}
          type="file"
          accept="application/pdf"
        />
      </div>
    </div>
  );
};

const HasFile = ({ file, removeFile }: HasFileProps) => {
  return (
    <div className="flex items-center justify-center mx-auto text-center border-2 rounded-md mt-1 pt-1 pb-1">
      <div className="bg-white w-22 rounded-md shadow-md flex gap-2 items-center justify-center">
        <FileIcon className="w-4 h-4 my-4 ml-4" />
        <span className="text-sm text-gray-500 my-4">{file?.name}</span>
        <button
          type="button"
          onClick={removeFile}
          className="place-self-start mt-1 p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export { Dropzone, HasFile };
