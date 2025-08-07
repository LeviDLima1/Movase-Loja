import Header from '../components/header/page';
import Footer from '@/components/footer/page';
import LivrosPublicos from './livros/page';

export default function Home() {
  return (
    <>
      <Header />

      <div className="md:h-screen">
        {/* Aqui vai a vitrine com os livros */}
        <LivrosPublicos />
      </div>

      <Footer />
    </>
  );
}
