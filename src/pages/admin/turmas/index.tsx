import { useEffect, useState } from "react"
import { useDatabase } from "../../../contexts/DatabaseContext"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useNavigate } from "react-router-dom"

export default function Turmas() {
    const { getTurmas, turmas, createTurma, updateTurmaStatus } = useDatabase()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate()
    const [newTurma, setNewTurma] = useState({
        nome: '',
        dataAbertura: '',
        dataFinal: ''
    })
    
    useEffect(() => {
        getTurmas()
    }, [])

    const formatFirebaseDate = (timestamp: any) => {
        if (!timestamp) return ''
        const date = new Date(timestamp.seconds * 1000)
        return format(date, "dd/MM/yyyy", { locale: ptBR })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createTurma(newTurma.nome, newTurma.dataAbertura, newTurma.dataFinal)
            setIsModalOpen(false)
            setNewTurma({
                nome: '',
                dataAbertura: '',
                dataFinal: ''
            })
        } catch (error) {
            console.error('Erro ao criar turma:', error)
            alert('Erro ao criar turma. Por favor, tente novamente.')
        }
    }

    const toggleTurmaStatus = async (e: React.MouseEvent, turmaId: string, currentStatus: boolean) => {
        e.stopPropagation()
        try {
            await updateTurmaStatus(turmaId, !currentStatus)
        } catch (error) {
            console.error('Erro ao atualizar status da turma:', error)
            alert('Erro ao atualizar status da turma. Por favor, tente novamente.')
        }
    }

    return (
        <div className="space-y-8 p-6">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gerenciar Turmas</h1>
                    <p className="text-gray-600 mt-2">
                        Visualize e gerencie as turmas do sistema
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Nova Turma
                </button>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {turmas.map((turma) => (
                    <div 
                        key={turma.id} 
                        className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                        onClick={() => navigate(`/admin/turmas/${turma.id}`)}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">{turma.nome}</h2>
                            <button
                                onClick={(e) => toggleTurmaStatus(e, turma.id, turma.aberto)}
                                className={`p-2 rounded-full transition-colors ${
                                    turma.aberto 
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                }`}
                                title={turma.aberto ? 'Turma Aberta' : 'Turma Fechada'}
                            >
                                {turma.aberto ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="space-y-2">
                            <div key={`${turma.id}-abertura`} className="flex justify-between items-center text-gray-600">
                                <span>Data de Abertura:</span>
                                <span>{formatFirebaseDate(turma.dataAbertura)}</span>
                            </div>
                            <div key={`${turma.id}-final`} className="flex justify-between items-center text-gray-600">
                                <span>Data de Encerramento:</span>
                                <span>{formatFirebaseDate(turma.dataFinal)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">Nova Turma</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome da Turma
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    value={newTurma.nome}
                                    onChange={(e) => setNewTurma({ ...newTurma, nome: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="dataAbertura" className="block text-sm font-medium text-gray-700 mb-1">
                                    Data de Abertura
                                </label>
                                <input
                                    type="date"
                                    id="dataAbertura"
                                    value={newTurma.dataAbertura}
                                    onChange={(e) => setNewTurma({ ...newTurma, dataAbertura: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="dataFinal" className="block text-sm font-medium text-gray-700 mb-1">
                                    Data Final
                                </label>
                                <input
                                    type="date"
                                    id="dataFinal"
                                    value={newTurma.dataFinal}
                                    onChange={(e) => setNewTurma({ ...newTurma, dataFinal: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Criar Turma
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}