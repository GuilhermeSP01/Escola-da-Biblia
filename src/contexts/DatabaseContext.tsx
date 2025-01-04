import { createContext, useContext, ReactNode, useState } from 'react'
import { db } from '../firebase/firebase'
import { collection, getDocs, query, where, addDoc, Timestamp, doc, updateDoc, writeBatch } from 'firebase/firestore'
import { auth } from '../firebase/firebase'

interface DatabaseContextType {
  turmas: Turma[]
  aulas: Aula[]
  getAulas: (turma: string) => void
  getTurmas: () => void
  createTurma: (nome: string, dataAbertura: string, dataFinal: string) => Promise<void>
  updateTurmaStatus: (turmaId: string, aberto: boolean) => Promise<void>
  createAula: (turma: string, numero: number, titulo: string, dataAbertura: string, dataLimite: string, videoAula: string, material: string) => Promise<void>
  updateQuestoes: (aulaId: string, questoes: Questao[]) => Promise<void>
  registerUserInOpenClass: (userId: string) => Promise<void>
  submitQuestionario: (aulaId: string, respostas: { questao: number, resposta: string }[]) => Promise<void>
  checkAndRegisterNewUser: (userId: string) => Promise<void>
  updateRespostasCorretas: (aulaId: string, respostas: { numero: number, resposta: string }[]) => Promise<void>
  getEnviosAluno: () => Promise<any[]>
  verificarQuestionarioEnviado: (aulaId: string) => Promise<boolean>
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
  videoAula: string
  material: string
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

  async function createAula(turma: string, numero: number, titulo: string, dataAbertura: string, dataLimite: string, videoAula: string, material: string) {
    const aulasRef = collection(db, 'aulas')
    await addDoc(aulasRef, {
      turma,
      numero,
      titulo,
      questoes: [],
      material,
      videoAula,
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

  async function registerUserInOpenClass(userId: string) {
    try {
      // Encontrar a turma aberta
      const turmasRef = collection(db, 'turmas');
      const q = query(turmasRef, where('aberto', '==', true));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Nenhuma turma aberta encontrada');
      }

      const turmaAberta = querySnapshot.docs[0];

      // Criar cadastro do aluno
      const cadastrosRef = collection(db, 'cadastros');
      await addDoc(cadastrosRef, {
        alunoId: userId,
        email: auth.currentUser?.email,
        turmaId: turmaAberta.id,
        envios: []
      });

      console.log('Usuário registrado na turma com sucesso');
    } catch (error) {
      console.error('Erro ao registrar usuário na turma:', error);
      throw error;
    }
  }

  async function submitQuestionario(aulaId: string, respostas: { questao: number, resposta: string }[]) {
    if (!auth.currentUser) throw new Error('Usuário não autenticado')

    // Verificar se o questionário já foi enviado
    const jaEnviado = await verificarQuestionarioEnviado(aulaId)
    if (jaEnviado) {
      throw new Error('Você já enviou este questionário')
    }

    try {
      // Buscar as respostas corretas
      const respostasRef = collection(db, 'respostas')
      const q = query(respostasRef, where('aulaId', '==', aulaId))
      const respostasSnapshot = await getDocs(q)
      
      if (respostasSnapshot.empty) {
        throw new Error('Respostas não encontradas para esta aula')
      }

      const respostasCorretas = respostasSnapshot.docs[0].data().questoes

      // Verificar as respostas e criar o objeto de envio
      const envio = {
        aulaId,
        dataEnvio: new Date().toISOString(),
        questoes: respostas.map(resp => {
          const questaoCorreta = respostasCorretas.find((q: any) => q.numero === resp.questao)
          return {
            questao: resp.questao,
            resposta: resp.resposta,
            correta: questaoCorreta?.resposta === resp.resposta
          }
        })
      }

      // Atualizar o cadastro do aluno
      const cadastrosRef = collection(db, 'cadastros')
      const cadastroQuery = query(cadastrosRef, where('alunoId', '==', auth.currentUser.uid))
      const cadastroSnapshot = await getDocs(cadastroQuery)

      if (!cadastroSnapshot.empty) {
        const cadastroDoc = cadastroSnapshot.docs[0]
        const cadastroData = cadastroDoc.data()

        await updateDoc(doc(db, 'cadastros', cadastroDoc.id), {
          envios: [...cadastroData.envios, envio]
        })
      }

      console.log('Questionário enviado com sucesso')
    } catch (error) {
      console.error('Erro ao enviar questionário:', error)
      throw error
    }
  }

  async function checkAndRegisterNewUser(userId: string) {
    try {
      // Verificar se o usuário já está cadastrado
      const cadastrosRef = collection(db, 'cadastros')
      const q = query(cadastrosRef, where('alunoId', '==', userId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        // Primeira vez do usuário, registrar na turma aberta
        await registerUserInOpenClass(userId)
      }
    } catch (error) {
      console.error('Erro ao verificar/registrar usuário:', error)
      throw error
    }
  }

  async function updateRespostasCorretas(aulaId: string, respostas: { numero: number, resposta: string }[]) {
    try {
      const respostasRef = collection(db, 'respostas')
      const q = query(respostasRef, where('aulaId', '==', aulaId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        // Se não existir, cria um novo documento
        await addDoc(respostasRef, {
          aulaId,
          questoes: respostas
        })
      } else {
        // Se existir, atualiza o documento existente
        const docRef = querySnapshot.docs[0].ref
        await updateDoc(docRef, {
          questoes: respostas
        })
      }

      console.log('Respostas corretas atualizadas com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar respostas corretas:', error)
      throw error
    }
  }

  async function verificarQuestionarioEnviado(aulaId: string) {
    if (!auth.currentUser) return false

    try {
      const cadastrosRef = collection(db, 'cadastros')
      const q = query(cadastrosRef, where('alunoId', '==', auth.currentUser.uid))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const cadastroData = querySnapshot.docs[0].data()
        return cadastroData.envios.some((envio: any) => envio.aulaId === aulaId)
      }

      return false
    } catch (error) {
      console.error('Erro ao verificar questionário enviado:', error)
      return false
    }
  }

  async function getEnviosAluno() {
    if (!auth.currentUser) return []

    try {
      const cadastrosRef = collection(db, 'cadastros')
      const q = query(cadastrosRef, where('alunoId', '==', auth.currentUser.uid))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const cadastroData = querySnapshot.docs[0].data()
        return cadastroData.envios.map((envio: any) => ({
          ...envio,
          aula: aulas.find(a => a.id === envio.aulaId)
        }))
      }

      return []
    } catch (error) {
      console.error('Erro ao obter envios do aluno:', error)
      return []
    }
  }

  const value = {
    turmas,
    aulas,
    getAulas,
    getTurmas,
    createTurma,
    updateTurmaStatus,
    createAula,
    updateQuestoes,
    registerUserInOpenClass,
    submitQuestionario,
    checkAndRegisterNewUser,
    updateRespostasCorretas,
    getEnviosAluno,
    verificarQuestionarioEnviado
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
