import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useDatabase } from '../../../contexts/DatabaseContext'

interface Envio {
    aulaId: string
    dataEnvio: string
    questoes: {
        questao: number
        resposta: string
        correta: boolean
    }[]
}

interface Cadastro {
    id: string
    alunoId: string
    email: string
    turmaId: string
    envios: Envio[]
}

export default function UserDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [cadastro, setCadastro] = useState<Cadastro | null>(null)
    const [loading, setLoading] = useState(true)
    const { aulas, getAulas, turmas, getTurmas } = useDatabase()

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return
            try {
                // Primeiro buscamos o cadastro para saber a turma
                const cadastroRef = doc(db, 'cadastros', id)
                const cadastroSnap = await getDoc(cadastroRef)
                
                if (cadastroSnap.exists()) {
                    const cadastroData = {
                        id: cadastroSnap.id,
                        ...cadastroSnap.data()
                    } as Cadastro

                    // Depois carregamos as turmas para poder buscar as aulas
                    await getTurmas()
                    const turma = turmas.find(t => t.id === cadastroData.turmaId)
                    if (turma) {
                        await getAulas(turma.nome)
                    }

                    setCadastro(cadastroData)
                }
            } catch (error) {
                console.error('Erro ao buscar cadastro:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    const getAulaTitulo = (aulaId: string) => {
        const aula = aulas.find(a => a.id === aulaId)
        return aula ? `Aula ${aula.numero} - ${aula.titulo}` : 'Aula não encontrada'
    }

    const calcularPorcentagemAcertos = (questoes: Envio['questoes']) => {
        const totalQuestoes = questoes.length
        const questoesCorretas = questoes.filter(q => q.correta).length
        const porcentagem = (questoesCorretas / totalQuestoes) * 100
        return porcentagem.toFixed(1)
    }

    const handleExcluirEnvio = async (index: number) => {
        if (!cadastro || !window.confirm('Tem certeza que deseja excluir este envio?')) return

        try {
            const novosEnvios = [...cadastro.envios]
            novosEnvios.splice(index, 1)

            const cadastroRef = doc(db, 'cadastros', cadastro.id)
            await updateDoc(cadastroRef, {
                envios: novosEnvios
            })

            setCadastro({
                ...cadastro,
                envios: novosEnvios
            })
        } catch (error) {
            console.error('Erro ao excluir envio:', error)
            alert('Erro ao excluir envio. Por favor, tente novamente.')
        }
    }

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="text-center text-gray-600">
                    Carregando dados do usuário...
                </div>
            </div>
        )
    }

    if (!cadastro) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="text-center text-gray-600">
                    Usuário não encontrado
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar para lista de usuários
                </button>
                <h1 className="text-3xl font-bold">{cadastro.email}</h1>
            </header>

            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold">Histórico de Envios</h2>
                    </div>
                    {cadastro.envios.length === 0 ? (
                        <div className="p-6 text-center text-gray-600">
                            Nenhum envio registrado
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {cadastro.envios.map((envio, index) => (
                                <div key={index} className="p-6 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {getAulaTitulo(envio.aulaId)}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Enviado em: {format(new Date(envio.dataEnvio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                            </p>
                                            <p className="mt-1 text-sm">
                                                <span className={`font-medium ${Number(calcularPorcentagemAcertos(envio.questoes)) >= 66 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {calcularPorcentagemAcertos(envio.questoes)}% de acertos
                                                </span>
                                                {' '}({envio.questoes.filter(q => q.correta).length} de {envio.questoes.length} questões)
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleExcluirEnvio(index)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Excluir envio"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
