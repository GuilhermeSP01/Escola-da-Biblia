import { createContext, useContext, ReactNode, useState } from 'react'
import { db } from '../firebase/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

interface DatabaseContextType {
  aulas: Aula[]
  getAulas: () => void
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

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [aulas, setAulas] = useState<Aula[]>([]);

  async function getAulas() {
    const aulasRef = collection(db, 'aulas');
    const q = query(aulasRef, where('turma', '==', '2024-B'))
    const querySnapshot = await getDocs(q)
    const aulasData: Aula[] = [];
  
    querySnapshot.forEach((doc) => {
      aulasData.push(doc.data() as Aula)
    })
  
    setAulas(aulasData)
    console.log('Aulas carregadas')
  }

  const value = {
    aulas,
    getAulas
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
