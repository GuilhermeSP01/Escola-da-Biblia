import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useDatabase } from '../../../contexts/DatabaseContext'
import { useNavigate } from 'react-router-dom'

interface Cadastro {
    id: string
    alunoId: string
    email: string
    turmaId: string
    envios: {
        aulaId: string
        dataEnvio: string
        questoes: {
            questao: number
            resposta: string
            correta: boolean
        }[]
    }[]
}

export default function Users() {
    const [cadastros, setCadastros] = useState<Cadastro[]>([])
    const [loading, setLoading] = useState(true)
    const { turmas, getTurmas } = useDatabase()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getTurmas()
                const cadastrosRef = collection(db, 'cadastros')
                const querySnapshot = await getDocs(cadastrosRef)
                const cadastrosData: Cadastro[] = []

                querySnapshot.forEach((doc) => {
                    cadastrosData.push({
                        id: doc.id,
                        ...doc.data()
                    } as Cadastro)
                })

                setCadastros(cadastrosData)
            } catch (error) {
                console.error('Erro ao buscar cadastros:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const getTurmaNome = (turmaId: string) => {
        const turma = turmas.find(t => t.id === turmaId)
        return turma?.nome || 'Turma não encontrada'
    }

    const getPresencas = (envios: Cadastro['envios']) => {
        if (!envios?.length) return 0
        
        return envios.reduce((presencas, envio) => {
            const totalQuestoes = envio.questoes.length
            const questoesCorretas = envio.questoes.filter(q => q.correta).length
            const porcentagem = (questoesCorretas / totalQuestoes) * 100
            
            return porcentagem >= 66 ? presencas + 1 : presencas
        }, 0)
    }

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="text-center text-gray-600">
                    Carregando dados dos usuários...
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
                <p className="text-gray-600 mt-2">Lista de todos os usuários cadastrados no sistema</p>
            </header>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Turma
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aulas Realizadas
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Presenças
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Última Atividade
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cadastros.map((cadastro) => (
                                <tr 
                                    key={cadastro.id} 
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => navigate(`/admin/users/${cadastro.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {cadastro.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {getTurmaNome(cadastro.turmaId)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {cadastro.envios?.length || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {getPresencas(cadastro.envios)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {cadastro.envios?.length > 0
                                            ? format(new Date(cadastro.envios[cadastro.envios.length - 1].dataEnvio), "dd/MM/yyyy HH:mm", { locale: ptBR })
                                            : 'Nenhuma atividade'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}