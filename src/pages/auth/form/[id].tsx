import { useParams } from 'react-router-dom'
import { useDatabase } from '../../../contexts/DatabaseContext'

export default function Form() {
  const { id } = useParams()

  const { aulas } = useDatabase()

  // Exemplo de questionário (posteriormente virá do banco de dados)
  const quiz = {
    title: 'Introdução',
    questions: [
      {
        id: 1,
        question: 'Qual é o primeiro livro da Bíblia?',
        options: ['Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronomio'],
      },
      {
        id: 2,
        question: 'Quem escreveu os primeiros cinco livros da Bíblia?',
        options: ['Moisés', 'Davi', 'Salomão', 'Abraão', 'Adão'],
      },
    ],
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <p className="text-gray-600">Questionário #{id}</p>
      </header>

      <form className="space-y-6">
        {aulas[Number(id)-1].questoes.map((questao: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow space-y-4">
            <p className="font-semibold">{index + 1}. {questao.pergunta}</p>
            <div className="space-y-2">
              {questao.alternativas.map((text: string, index: number) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`question-${questao.numero}`}
                    className="form-radio"
                  />
                  <span>{text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Enviar Respostas
        </button>
      </form>
    </div>
  )
}
