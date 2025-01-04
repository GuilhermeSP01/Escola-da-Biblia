import { Link } from 'react-router-dom'
import videoIcon from '../../../assets/icons/videoIcon.png'
import materialIcon from '../../../assets/icons/materialIcon.png'
import formIcon from '../../../assets/icons/formIcon.png'
import { useDatabase } from '../../../contexts/DatabaseContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Dashboard() {
  const { aulas } = useDatabase()

  const formatFirebaseDate = (timestamp: any) => {
    if (!timestamp) return ''
    const date = new Date(timestamp.seconds * 1000)
    return format(date, "dd/MM/yyyy", { locale: ptBR })
  }

  return (
    <div className="space-y-8">    
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Aulas</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aulas.map((aula) => (
            <div key={aula.numero} className='space-y-2'>
              <h3 className="font-semibold text-lg mb-2">
                <span className='text-bold text-xl'>Aula {aula.numero}</span>
                <span className="text-gray-600"> | {aula.titulo}</span>
              </h3>
              <Link
                to={aula.videoAula}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition flex justify-between"
              >
                <p className="text-gray-600 flex text-lg">
                <img src={videoIcon} alt="Descrição da imagem" className="w-8 h-8 mr-2" /> Video Aula
                </p>
                <p className='text-gray-500'>{formatFirebaseDate(aula.dataAbertura)}</p>
              </Link>
              <Link
                to={aula.material}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition flex justify-between"
              >
                <p className="text-gray-600 flex text-lg">
                <img src={materialIcon} alt="Descrição da imagem" className="w-8 h-8 mr-2" /> Material
                </p>
                <p className='text-gray-500'>{formatFirebaseDate(aula.dataAbertura)}</p>
              </Link>
              <Link
                to={`/form/${aula.numero}`}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition flex justify-between"
              >
                <p className="text-gray-600 flex text-lg">
                <img src={formIcon} alt="Descrição da imagem" className="w-8 h-8 mr-2" /> Questionário
                </p>
                <p className='text-gray-500'>até {formatFirebaseDate(aula.dataLimite)}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Seu Progresso</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Em breve você poderá acompanhar seu progresso aqui.</p>
        </div>
      </section> */}
    </div>
  )
}
