import { createContext, useContext, ReactNode, useState } from 'react'
import { db } from '../firebase/firebase'
import { collection, getDocs, query, where, addDoc, Timestamp, doc, updateDoc, writeBatch } from 'firebase/firestore'

interface DatabaseContextType {
  turmas: Turma[]
  aulas: Aula[]
  getAulas: (turma: string) => void
  getTurmas: () => void
  createTurma: (nome: string, dataAbertura: string, dataFinal: string) => Promise<void>
  updateTurmaStatus: (turmaId: string, aberto: boolean) => Promise<void>
  createAula: (turma: string, numero: number, titulo: string, dataAbertura: string, dataLimite: string) => Promise<void>
  updateQuestoes: (aulaId: string, questoes: Questao[]) => Promise<void>
}

const DatabaseContext = createContext<DatabaseContextType | null>(null)

interface DatabaseProviderProps {
  children: ReactNode
}

interface Questao {
  pergunta: string
  alternativas: string[]
}

interface Aula {
  id: string
  numero: number
  titulo: string
  turma: string
  questoes: Questao[]
  dataAbertura: string
  dataLimite: string
}

interface Turma {
  id: string
  nome: string
  aberto: boolean
  dataAbertura: Date
  dataFinal: Date
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  async function getAulas(turma: string) {
    const aulasRef = collection(db, 'aulas');
    const q = query(aulasRef, where('turma', '==', turma))
    const querySnapshot = await getDocs(q)
    const aulasData: Aula[] = [];
  
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      aulasData.push({
        id: doc.id,
        ...data
      } as Aula)
    })
  
    setAulas(aulasData)
    console.log('Aulas carregadas')
  }

  async function getTurmas() {
    const turmasRef = collection(db, 'turmas');
    const querySnapshot = await getDocs(turmasRef)
    const turmasData: Turma[] = [];
  
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      turmasData.push({
        id: doc.id,
        ...data
      } as Turma)
    })
  
    setTurmas(turmasData)
    console.log('Turmas carregadas')
  }

  async function createTurma(nome: string, dataAbertura: string, dataFinal: string) {
    const turmasRef = collection(db, 'turmas')
    await addDoc(turmasRef, {
      nome,
      aberto: false,
      dataAbertura: Timestamp.fromDate(new Date(dataAbertura)),
      dataFinal: Timestamp.fromDate(new Date(dataFinal))
    })
    getTurmas()
    console.log('Turmas carregadas')
  }

  async function updateTurmaStatus(turmaId: string, aberto: boolean) {
    try {
      if (aberto) {
        // Primeiro, fecha todas as turmas
        const turmasRef = collection(db, 'turmas')
        const querySnapshot = await getDocs(turmasRef)
        const batch = writeBatch(db)

        querySnapshot.docs.forEach((doc) => {
          batch.update(doc.ref, { aberto: false })
        })

        await batch.commit()
      }

      // Depois, atualiza o status da turma selecionada
      const turmaRef = doc(db, 'turmas', turmaId)
      await updateDoc(turmaRef, {
        aberto
      })

      getTurmas()
    } catch (error) {
      console.error('Error updating turma status:', error)
      throw error
    }
  }

  async function createAula(turma: string, numero: number, titulo: string, dataAbertura: string, dataLimite: string) {
    const aulasRef = collection(db, 'aulas')
    await addDoc(aulasRef, {
      turma,
      numero,
      titulo,
      questoes: [],
      dataAbertura: Timestamp.fromDate(new Date(dataAbertura)),
      dataLimite: Timestamp.fromDate(new Date(dataLimite))
    })
    getAulas(turma)
  }

  const updateQuestoes = async (aulaId: string, questoes: Questao[]) => {
    try {
      const aulaRef = doc(db, 'aulas', aulaId)
      await updateDoc(aulaRef, {
        questoes
      })
      getAulas(aulas.find(a => a.id === aulaId)?.turma || '')
    } catch (error) {
      console.error('Error updating questions:', error)
      throw error
    }
  }

  const value = {
    aulas,
    turmas,
    getAulas,
    getTurmas,
    createTurma,
    updateTurmaStatus,
    createAula,
    updateQuestoes
  }

  return (
    <DatabaseContext.Provider value={value as DatabaseContextType}>
      {children}
    </DatabaseContext.Provider>
  )
}

export function useDatabase() {
  const context = useContext(DatabaseContext)
  if (!context) {
    throw new Error('useDatabase deve ser usado dentro de um DatabaseProvider')
  }
  return context
}
