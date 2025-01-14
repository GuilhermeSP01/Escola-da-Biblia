import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDatabase } from '../../../contexts/DatabaseContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'
// import { format } from 'date-fns'
// import { ptBR } from 'date-fns/locale'

interface Envio {
  aulaId: string
  dataEnvio: string
  questoes: {
    questao: number
    resposta: string
    correta: boolean
  }[]
}

export default function Form() {
  const { id } = useParams()
  const { aulas, submitQuestionario, verificarQuestionarioEnviado, getEnviosAluno } = useDatabase()
  const [respostas, setRespostas] = useState<{ questao: number, resposta: string }[]>([])
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null)
  const [jaEnviado, setJaEnviado] = useState<boolean | null>(null)
  const [envioAtual, setEnvioAtual] = useState<Envio | null>(null)
  const [respostasCorretas, setRespostasCorretas] = useState<{ [key: number]: string }>({})
  const aula = aulas.find(a => a.numero === Number(id))

  // const formatFirebaseDate = (timestamp: any) => {
  //   if (!timestamp) return ''
  //   const date = new Date(timestamp.seconds * 1000)
  //   return format(date, "dd/MM/yyyy", { locale: ptBR })
  // }
  
  useEffect(() => {
    if (aula) {
      const verificarEnvio = async () => {
        const enviado = await verificarQuestionarioEnviado(aula.id)
        setJaEnviado(enviado)
        
        if (enviado) {
          const envios = await getEnviosAluno()
          const envio = envios.find(e => e.aulaId === aula.id)
          if (envio) {
            setEnvioAtual(envio)
          }
        }
      }
      verificarEnvio()
      
      // Carregar respostas corretas
      const carregarRespostas = async () => {
        try {
          const respostasRef = collection(db, 'respostas')
          const q = query(respostasRef, where('aulaId', '==', aula.id))
          const querySnapshot = await getDocs(q)
          
          if (!querySnapshot.empty) {
            const respostasDoc = querySnapshot.docs[0].data()
            const respostasMap: { [key: number]: string } = {}
            respostasDoc.questoes.forEach((q: { numero: number, resposta: string }) => {
              respostasMap[q.numero] = q.resposta
            })
            setRespostasCorretas(respostasMap)
          }
        } catch (error) {
          console.error('Erro ao carregar respostas:', error)
        }
      }
      carregarRespostas()
    }
  }, [aula])

  const getLetraAlternativa = (index: number) => {
    return String.fromCharCode(97 + index) // 97 é o código ASCII para 'a'
  }

  const handleRespostaChange = (questaoIndex: number, resposta: string) => {
    setRespostas(prev => {
      const novasRespostas = [...prev]
      const index = novasRespostas.findIndex(r => r.questao === questaoIndex + 1)
      
      if (index >= 0) {
        novasRespostas[index] = { questao: questaoIndex + 1, resposta }
      } else {
        novasRespostas.push({ questao: questaoIndex + 1, resposta })
      }
      
      return novasRespostas
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aula) return

    setEnviando(true)
    setMensagem(null)

    try {
      // Verificar se todas as questões foram respondidas
      if (respostas.length !== aula.questoes.length) {
        throw new Error('Por favor, responda todas as questões antes de enviar')
      }

      await submitQuestionario(aula.id, respostas)
      setMensagem({ tipo: 'sucesso', texto: 'Questionário enviado com sucesso!' })
      setJaEnviado(true)
      
      // Buscar o envio atualizado
      const envios = await getEnviosAluno()
      const envio = envios.find(e => e.aulaId === aula.id)
      if (envio) {
        setEnvioAtual(envio)
      }
      
      // Limpar respostas após envio bem-sucedido
      setRespostas([])
    } catch (error: any) {
      setMensagem({ tipo: 'erro', texto: error.message || 'Erro ao enviar questionário' })
    } finally {
      setEnviando(false)
    }
  }

  const calcularPorcentagemAcertos = (questoes: Envio['questoes']) => {
    const acertos = questoes.filter(q => q.correta).length
    const total = questoes.length
    const porcentagem = (acertos / total) * 100
    return {
      acertos,
      total,
      porcentagem,
      aprovado: porcentagem >= 66
    }
  }

  if (jaEnviado === null) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center text-gray-600">
          Carregando...
        </div>
      </div>
    )
  }

  if(aula?.dataLimite) {
    if (!jaEnviado && aula?.dataLimite.seconds * 1000 < new Date().valueOf()) {
      return (
          <div className="max-w-2xl mx-auto p-4">
            <div className="text-center text-gray-600">
              O questionário expirou.
            </div>
          </div>
      )
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{aula?.titulo}</h1>
        <p className="text-gray-600">Questionário #{id}</p>
      </header>

      {mensagem && (
        <div className={`p-4 rounded-lg ${
          mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {mensagem.texto}
        </div>
      )}

      {jaEnviado && envioAtual ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Resultados do seu envio
              </h2>
              <div className="text-sm text-gray-500">
                Enviado em: {new Date(envioAtual.dataEnvio).toLocaleString()}
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                calcularPorcentagemAcertos(envioAtual.questoes).aprovado
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {calcularPorcentagemAcertos(envioAtual.questoes).acertos}/{calcularPorcentagemAcertos(envioAtual.questoes).total} questões corretas
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                calcularPorcentagemAcertos(envioAtual.questoes).aprovado
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {calcularPorcentagemAcertos(envioAtual.questoes).aprovado ? 'Aprovado' : 'Reprovado'}
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              {envioAtual.questoes.map((questao, index) => {
                const questaoCompleta = aula?.questoes[questao.questao - 1]
                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        questao.correta
                          ? 'bg-green-100 text-green-500'
                          : 'bg-red-100 text-red-500'
                      }`}>
                        {questao.correta ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {questao.questao}. {questaoCompleta?.pergunta}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          {questaoCompleta?.alternativas.map((alternativa, altIndex) => {
                            const letra = String.fromCharCode(97 + altIndex).toUpperCase()
                            const suaResposta = questao.resposta.toUpperCase() === letra
                            const respostaCorreta = letra === respostasCorretas[questao.questao]?.toUpperCase()
                            
                            return (
                              <div 
                                key={altIndex}
                                className={`p-2 rounded ${
                                  respostaCorreta && suaResposta
                                    ? 'bg-green-50 border border-green-200'
                                    : suaResposta && !questao.correta
                                    ? 'bg-red-50 border border-red-200'
                                    : respostaCorreta
                                    ? 'bg-gray-50 border border-gray-200' //'bg-green-50 border border-green-200 opacity-50'
                                    : 'bg-gray-50 border border-gray-200'
                                }`}
                              >
                                <div className="flex items-start">
                                  <span className="mr-2">{letra + ')'}</span>
                                  <span className="flex-1">{alternativa}</span>
                                  <div className="flex items-center space-x-2 ml-2">
                                    {/* {suaResposta && (
                                      <span className={`text-sm ${
                                        questao.correta 
                                          ? 'text-green-600'
                                          : 'text-red-600'
                                      }`}>
                                        Sua resposta
                                      </span>
                                    )}
                                    {respostaCorreta && !suaResposta && (
                                      <span className="text-sm text-green-600">
                                        Resposta correta
                                      </span>
                                    )} */}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {aula?.questoes.map((questao: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow space-y-4">
              <p className="font-semibold">{index + 1}. {questao.pergunta}</p>
              <div className="space-y-2">
                {questao.alternativas.map((text: string, altIndex: number) => (
                  <label key={altIndex} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`questao-${index}`}
                      value={getLetraAlternativa(altIndex)}
                      onChange={(e) => handleRespostaChange(index, e.target.value)}
                      checked={respostas.find(r => r.questao === index + 1)?.resposta === getLetraAlternativa(altIndex)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-gray-700">
                      {getLetraAlternativa(altIndex) + ')'} {text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={enviando}
              className={`${
                enviando 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-4 py-2 rounded-lg transition-colors`}
            >
              {enviando ? 'Enviando...' : 'Enviar Respostas'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
