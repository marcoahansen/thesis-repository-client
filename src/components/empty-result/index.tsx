import { FolderX } from "lucide-react";

export function EmptyResult() {
  return (
    <div className="w-full min-h-72 bg-white flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <FolderX color="#014065" size={48} />
        <p>Sua pesquisa não retornou nenhum resultado.</p>
        <p className="italic">Limpe os filtros e tente novamente.</p>
      </div>
    </div>
  );
}
