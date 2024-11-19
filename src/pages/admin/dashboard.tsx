import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Admin() {
  const { user } = useAuth()

  const adminSections = [
    {
      id: 'users',
      title: 'Gerenciar Usuários',
      description: 'Visualize e gerencie os usuários do sistema',
      path: '/admin/users'
    },
    {
      id: 'lessons',
      title: 'Gerenciar Aulas',
      description: 'Crie, edite e organize as aulas do curso',
      path: '/admin/lessons'
    },
    {
      id: 'forms',
      title: 'Gerenciar Questionários',
      description: 'Crie e edite questionários para as aulas',
      path: '/admin/forms'
    },
    {
      id: 'reports',
      title: 'Relatórios',
      description: 'Visualize relatórios e estatísticas do sistema',
      path: '/admin/reports'
    }
  ]

  return (
    <div className="space-y-8 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo(a), {user?.displayName}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {adminSections.map((section) => (
          <Link
            key={section.id}
            to={section.path}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {section.title}
            </h2>
            <p className="text-gray-600">
              {section.description}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Atividade Recente</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Nenhuma atividade recente para mostrar.
          </p>
        </div>
      </section>
    </div>
  )
}
