import { useParams } from 'react-router-dom'

export default function Form() {
  const { id } = useParams()

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
        {quiz.questions.map((question) => (
          <div key={question.id} className="bg-white p-6 rounded-lg shadow space-y-4">
            <p className="font-semibold">{question.id}. {question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    className="form-radio"
                  />
                  <span>{option}</span>
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
