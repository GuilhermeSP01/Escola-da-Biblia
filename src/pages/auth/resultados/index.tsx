import { useEffect, useState } from 'react'
import { useDatabase } from '../../../contexts/DatabaseContext'

interface Envio {
  aulaId: string
  dataEnvio: string
  questoes: {
    questao: number
    resposta: string
    correta: boolean
  }[]
  aula?: {
    titulo: string
    numero: number
  }
}

export default function Resultados() {
  const { getEnviosAluno } = useDatabase()
  const [envios, setEnvios] = useState<Envio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarEnvios = async () => {
      try {
        const enviosData = await getEnviosAluno()
        setEnvios(enviosData.sort((a, b) => {
          // Ordenar por número da aula
          return (a.aula?.numero || 0) - (b.aula?.numero || 0)
        }))
      } catch (error) {
        console.error('Erro ao carregar envios:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarEnvios()
  }, [getEnviosAluno])

  const calcularPorcentagemAcertos = (questoes: Envio['questoes']) => {
    const acertos = questoes.filter(q => q.correta).length
    return ((acertos / questoes.length) * 100).toFixed(1)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">
          Carregando resultados...
        </div>
      </div>
    )
  }

  if (envios.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">
          Você ainda não enviou nenhum questionário.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Meus Resultados</h1>

      <div className="space-y-6">
        {envios.map((envio, index) => (
          <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Aula {envio.aula?.numero}: {envio.aula?.titulo}
                </h2>
                <div className="text-sm text-gray-500">
                  Enviado em: {new Date(envio.dataEnvio).toLocaleString()}
                </div>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  Number(calcularPorcentagemAcertos(envio.questoes)) >= 70
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {calcularPorcentagemAcertos(envio.questoes)}% de acertos
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {envio.questoes.map((questao, qIndex) => (
                  <div key={qIndex} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      questao.correta
                        ? 'bg-green-100 text-green-500'
                        : 'bg-red-100 text-red-500'
                    }`}>
                      {questao.correta ? '✓' : '✗'}
                    </div>
                    <div>
                      <p className="font-medium">Questão {questao.questao}</p>
                      <p className="text-sm text-gray-600">
                        Sua resposta: {questao.resposta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
