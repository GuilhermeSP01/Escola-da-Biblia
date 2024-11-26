import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDatabase } from "../../../contexts/DatabaseContext"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function TurmaDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { turmas, getAulas, aulas } = useDatabase()
    const turma = turmas.find(t => t.id === id)

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
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Aulas</h2>
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
