import { useParams } from 'react-router-dom'
import { useDatabase } from '../../../contexts/DatabaseContext'

export default function Form() {
  const { id } = useParams()
  const { aulas } = useDatabase()
  
  const getLetraAlternativa = (index: number) => {
    return String.fromCharCode(97 + index) // 97 é o código ASCII para 'a'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{aulas.find(a => a.numero === Number(id))?.titulo}</h1>
        <p className="text-gray-600">Questionário #{id}</p>
      </header>

      <form className="space-y-6">
        {aulas.find(a => a.numero === Number(id))?.questoes.map((questao: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow space-y-4">
            <p className="font-semibold">{index + 1}. {questao.pergunta}</p>
            <div className="space-y-2">
              {questao.alternativas.map((text: string, index: number) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`questao-${index}`}
                    className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-gray-700">
                    {getLetraAlternativa(index) + ')'} {text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Enviar Respostas
          </button>
        </div>
      </form>
    </div>
  )
}
