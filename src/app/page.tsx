import Header from '../components/header/page';
import Footer from '@/components/footer/page';
import LivrosPublicos from './livros/page';

export default function Home() {
  return (
    <>
      <Header />

      <div className="md:h-screen">
        {/* Aqui vai a vitrine com os livros */}
        <div className="p-6 w-7xl h-full max-sm:w-auto mx-auto bg-zinc-100 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 ">Livros Disponíveis</h2>
          <LivrosPublicos />
        </div>
      </div>

      <Footer />
    </>
  );
}
