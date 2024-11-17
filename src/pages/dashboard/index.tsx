import { Link } from 'react-router-dom'
import videoIcon from '../../assets/icons/videoIcon.png'
import materialIcon from '../../assets/icons/materialIcon.png'
import formIcon from '../../assets/icons/formIcon.png'

export default function Dashboard() {
  const availableLessons = [
    { id: 1, title: 'Introdução', date: '01/01/2023', limitDate: '03/01/2023' },
    { id: 2, title: 'Era Patriarcal', date: '02/01/2023', limitDate: '05/01/2023' },
    { id: 3, title: '???', date: '03/01/2023', limitDate: '08/01/2023' },
  ]

  return (
    <div className="space-y-8">    
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Aulas</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableLessons.map((form) => (
            <div key={form.id} className='space-y-2'>
              <h3 className="font-semibold text-lg mb-2">
                <span className='text-bold text-xl'>Aula {form.id}</span>
                <span className="text-gray-600"> | {form.title}</span>
              </h3>
              <Link
                to={`/form/${form.id}`}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition flex justify-between"
              >
                <p className="text-gray-600 flex text-lg">
                <img src={videoIcon} alt="Descrição da imagem" className="w-8 h-8 mr-2" /> Video Aula
                </p>
                <p className='text-gray-500'>{form.date}</p>
              </Link>
              <Link
                to={`/form/${form.id}`}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition flex justify-between"
              >
                <p className="text-gray-600 flex text-lg">
                <img src={materialIcon} alt="Descrição da imagem" className="w-8 h-8 mr-2" /> Material
                </p>
                <p className='text-gray-500'>{form.date}</p>
              </Link>
              <Link
                to={`/form/${form.id}`}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition flex justify-between"
              >
                <p className="text-gray-600 flex text-lg">
                <img src={formIcon} alt="Descrição da imagem" className="w-8 h-8 mr-2" /> Questionário
                </p>
                <p className='text-gray-500'>até {form.limitDate}</p>
              </Link>
            </div>
          ))}
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
