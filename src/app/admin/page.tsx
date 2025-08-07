import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/admin/livros" className="text-blue-500 hover:underline">
            Gerenciar Livros
          </Link>
        </li>
        <li>
          <Link href="/admin/postagens" className="text-blue-500 hover:underline">
            Gerenciar Postagens do Blog
          </Link>
        </li>
      </ul>
    </div>
  );
}