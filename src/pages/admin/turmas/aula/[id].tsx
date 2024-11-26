import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDatabase } from "../../../../contexts/DatabaseContext"
import type { Questao } from "../../../../contexts/DatabaseContext"
import { db } from '../../../../firebase/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function AulaQuestoes() {
    const { aulaId } = useParams()
    const navigate = useNavigate()
    const { aulas, updateQuestoes, updateRespostasCorretas } = useDatabase()
    const aula = aulas.find(a => a.id === aulaId)
    const [questoes, setQuestoes] = useState<Questao[]>([])
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [respostasCorretas, setRespostasCorretas] = useState<{ [key: number]: string }>({})

    useEffect(() => {
        if (aula) {
            setQuestoes(aula.questoes || [])
            // Carregar respostas corretas
            const carregarRespostas = async () => {
                try {
                    const respostasRef = collection(db, 'respostas')
                    const q = query(respostasRef, where('aulaId', '==', aulaId))
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
    }, [aula, aulaId])

    const handleSave = async () => {
        if (!aula) return
        try {
            await updateQuestoes(aula.id, questoes)
            // Salvar respostas corretas
            const respostasArray = Object.entries(respostasCorretas).map(([numero, resposta]) => ({
                numero: parseInt(numero),
                resposta
            }))
            await updateRespostasCorretas(aula.id, respostasArray)
            setEditingIndex(null)
        } catch (error) {
            console.error('Error saving questions:', error)
            alert('Erro ao salvar questões. Por favor, tente novamente.')
        }
    }

    const addQuestao = () => {
        setQuestoes([...questoes, { pergunta: '', alternativas: [''] }])
        setEditingIndex(questoes.length)
    }

    const updateQuestao = (index: number, pergunta: string) => {
        const newQuestoes = [...questoes]
        newQuestoes[index] = { ...newQuestoes[index], pergunta }
        setQuestoes(newQuestoes)
    }

    const addAlternativa = (questaoIndex: number) => {
        const newQuestoes = [...questoes]
        newQuestoes[questaoIndex].alternativas.push('')
        setQuestoes(newQuestoes)
    }

    const updateAlternativa = (questaoIndex: number, alternativaIndex: number, texto: string) => {
        const newQuestoes = [...questoes]
        newQuestoes[questaoIndex].alternativas[alternativaIndex] = texto
        setQuestoes(newQuestoes)
    }

    const removeAlternativa = (questaoIndex: number, alternativaIndex: number) => {
        const newQuestoes = [...questoes]
        newQuestoes[questaoIndex].alternativas.splice(alternativaIndex, 1)
        setQuestoes(newQuestoes)
    }

    const removeQuestao = (index: number) => {
        const newQuestoes = [...questoes]
        newQuestoes.splice(index, 1)
        setQuestoes(newQuestoes)
    }

    const getLetraAlternativa = (index: number) => {
        return String.fromCharCode(97 + index) // 97 é o código ASCII para 'a'
    }

    if (!aula) {
        return (
            <div className="p-6">
                <div className="text-center text-gray-600">
                    Aula não encontrada
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Aula {aula.numero}: {aula.titulo}
                    </h1>
                    <p className="text-gray-600 mt-1">Gerenciar Questões</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-600 hover:text-gray-800"
                >
                    Voltar
                </button>
            </header>

            <div className="space-y-6">
                {questoes.map((questao, questaoIndex) => (
                    <div key={questaoIndex} className="bg-white p-6 rounded-lg shadow space-y-4">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                {editingIndex === questaoIndex ? (
                                    <input
                                        type="text"
                                        value={questao.pergunta}
                                        onChange={(e) => updateQuestao(questaoIndex, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Digite a pergunta"
                                    />
                                ) : (
                                    <h3 className="text-xl font-semibold">
                                        {questao.pergunta || 'Nova Questão'}
                                    </h3>
                                )}
                            </div>
                            <div className="flex space-x-4">
                                {editingIndex === questaoIndex ? (
                                    <button
                                        onClick={handleSave}
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        Salvar
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setEditingIndex(questaoIndex)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        Editar
                                    </button>
                                )}
                                <button
                                    onClick={() => removeQuestao(questaoIndex)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-700">Alternativas</h4>
                                {editingIndex === questaoIndex && (
                                    <button
                                        onClick={() => addAlternativa(questaoIndex)}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        + Adicionar Alternativa
                                    </button>
                                )}
                            </div>
                            {editingIndex === questaoIndex ? (
                                <div className="space-y-2">
                                    {questao.alternativas.map((alternativa: string, alternativaIndex: number) => (
                                        <div key={alternativaIndex} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name={`resposta-correta-${questaoIndex}`}
                                                checked={respostasCorretas[questaoIndex + 1] === getLetraAlternativa(alternativaIndex)}
                                                onChange={() => {
                                                    setRespostasCorretas({
                                                        ...respostasCorretas,
                                                        [questaoIndex + 1]: getLetraAlternativa(alternativaIndex)
                                                    })
                                                }}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-500 w-6">
                                                {getLetraAlternativa(alternativaIndex)}
                                            </span>
                                            <input
                                                type="text"
                                                value={alternativa}
                                                onChange={(e) => updateAlternativa(questaoIndex, alternativaIndex, e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded-md"
                                                placeholder={`Alternativa ${getLetraAlternativa(alternativaIndex)}`}
                                            />
                                            <button
                                                onClick={() => removeAlternativa(questaoIndex, alternativaIndex)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2 pl-4">
                                    {questao.alternativas.map((alternativa: string, alternativaIndex: number) => (
                                        <div key={alternativaIndex} className={`text-gray-600 flex items-center space-x-2`}>
                                            {respostasCorretas[questaoIndex + 1] === getLetraAlternativa(alternativaIndex) && (
                                                <span className="text-green-500">✓</span>
                                            )}
                                            <span>{getLetraAlternativa(alternativaIndex) + '.'} {alternativa}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    onClick={addQuestao}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors"
                >
                    + Adicionar Nova Questão
                </button>
            </div>
        </div>
    )
}
