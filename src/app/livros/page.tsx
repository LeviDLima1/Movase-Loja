import LivroCard from "@/components/livrosCard/page";

export default function LivrosPublicos() {
  return (
    <div className="p-6 w-7xl max-sm:w-auto mx-auto">
      <h2 className="text-2xl font-bold mb-4 ">Livros Disponíveis</h2>
      {/* Aqui entra a listagem pública de livros */}
      <LivroCard />
    </div>
  );
}
