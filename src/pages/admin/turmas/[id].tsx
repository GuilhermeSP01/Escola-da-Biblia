import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDatabase } from "../../../contexts/DatabaseContext"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function TurmaDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { turmas, getAulas, aulas, createAula } = useDatabase()
    const turma = turmas.find(t => t.id === id)
    const [isCreating, setIsCreating] = useState(false)
    const [newAula, setNewAula] = useState({
        numero: '',
        titulo: '',
        dataAbertura: '',
        dataLimite: ''
    })

    useEffect(() => {
        if (turma?.nome) {
            getAulas(turma.nome)
        }
    }, [])

    const formatFirebaseDate = (timestamp: any) => {
        if (!timestamp) return ''
        const date = new Date(timestamp.seconds * 1000)
        return format(date, "dd/MM/yyyy", { locale: ptBR })
    }

    if (!turma) {
        return (
            <div className="p-6">
                <div className="text-center text-gray-600">
                    Turma não encontrada
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 p-6">
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{turma.nome}</h1>
                        <p className="text-gray-600 mt-2">
                            {turma.aberto ? (
                                <span className="text-green-600">Turma Aberta</span>
                            ) : (
                                <span className="text-red-600">Turma Fechada</span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Data de Abertura</p>
                        <p className="text-lg font-semibold">{formatFirebaseDate(turma.dataAbertura)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Data de Encerramento</p>
                        <p className="text-lg font-semibold">{formatFirebaseDate(turma.dataFinal)}</p>
                    </div>
                </div>
            </header>

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Aulas</h2>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Nova Aula
                    </button>
                </div>

                {isCreating && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-semibold mb-4">Nova Aula</h3>
                            <form onSubmit={async (e) => {
                                e.preventDefault()
                                try {
                                    await createAula(
                                        turma.nome,
                                        Number(newAula.numero),
                                        newAula.titulo,
                                        newAula.dataAbertura,
                                        newAula.dataLimite
                                    )
                                    setIsCreating(false)
                                    setNewAula({
                                        numero: '',
                                        titulo: '',
                                        dataAbertura: '',
                                        dataLimite: ''
                                    })
                                } catch (error) {
                                    console.error('Erro ao criar aula:', error)
                                    alert('Erro ao criar aula. Por favor, tente novamente.')
                                }
                            }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Número da Aula
                                    </label>
                                    <input
                                        type="number"
                                        value={newAula.numero}
                                        onChange={(e) => setNewAula(prev => ({ ...prev, numero: e.target.value }))}
                                        className="w-full p-2 border rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        value={newAula.titulo}
                                        onChange={(e) => setNewAula(prev => ({ ...prev, titulo: e.target.value }))}
                                        className="w-full p-2 border rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Data de Abertura
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={newAula.dataAbertura}
                                        onChange={(e) => setNewAula(prev => ({ ...prev, dataAbertura: e.target.value }))}
                                        className="w-full p-2 border rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Data Limite
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={newAula.dataLimite}
                                        onChange={(e) => setNewAula(prev => ({ ...prev, dataLimite: e.target.value }))}
                                        className="w-full p-2 border rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Criar Aula
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {aulas.map((aula) => (
                        <div
                            key={aula.id}
                            onClick={() => navigate(`/admin/turmas/${id}/aula/${aula.id}`)}
                            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                Aula {aula.numero}
                            </h3>
                            <p className="text-gray-600">{aula.titulo}</p>
                            <div className="mt-4 text-sm text-gray-500">
                                <p>Abertura: {formatFirebaseDate(aula.dataAbertura)}</p>
                                <p>Limite: {formatFirebaseDate(aula.dataLimite)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
