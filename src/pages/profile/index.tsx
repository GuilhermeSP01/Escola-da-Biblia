export default function Profile() {
  const nome = localStorage.getItem('nome');
  const email = localStorage.getItem('email');
  const turma = localStorage.getItem('turma');
  const dataInscricao = localStorage.getItem('dataInscricao');

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Perfil</h1>
      </header>
      
      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-semibold">Informações pessoais</h2>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Nome: {nome}</p>
          <button>Editar</button>
        </div>
        <p className="text-gray-600">Email: {email}</p>
        <p className="text-gray-600">Turma: {turma}</p>
        <p className="text-gray-600">Data da inscrição: {dataInscricao}</p>
        <div className="flex justify-end space-x-8">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Baixar certificado</button>
          <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Sair</button>
        </div>
      </section>

      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Seu Progresso</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Em breve você poderá acompanhar seu progresso aqui.</p>
        </div>
      </section>
    </div>
  )
}
