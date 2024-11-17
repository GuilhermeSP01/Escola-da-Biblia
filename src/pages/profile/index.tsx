import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
  const { logout, user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [error, setError] = useState('');

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const handleUpdateName = async () => {
    try {
      await updateUserProfile(newName);
      setIsEditing(false);
      setError('');
    } catch (error) {
      setError('Erro ao atualizar o nome. Tente novamente.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Perfil</h1>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          {isEditing ? (
            <div className="flex items-center gap-4 flex-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="Seu nome"
              />
              <button
                onClick={handleUpdateName}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewName(user?.displayName || '');
                  setError('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600">Nome: {user?.displayName}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-blue-600"
              >
                Editar
              </button>
            </>
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-gray-600">Email: {user?.email}</p>
        <p className="text-gray-600">Turma: </p>
        <p className="text-gray-600">Data da inscrição: {formatDate(user?.metadata.creationTime)}</p>
        <div className="flex justify-end space-x-4 mt-6">
          <button 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg 
              className="mr-2 -ml-1 h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
              />
            </svg>
            Baixar certificado
          </button>
          <button 
            onClick={logout}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <svg 
              className="mr-2 -ml-1 h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            Sair
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Seu Progresso</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Em breve você poderá acompanhar seu progresso aqui.</p>
        </div>
      </section>
    </div>
  );
}
