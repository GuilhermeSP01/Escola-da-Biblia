import { useState } from "react";
import { useDatabase } from "../../../contexts/DatabaseContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dados() {
    const { updateCadastro } = useDatabase()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [telefone, setTelefone] = useState('')
    const [endereco, setEndereco] = useState({
        tipoLogradouro: '',
        nomeLogradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
    })
    const [erro, setErro] = useState('')

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const formattedValue = value.replace(/\D+/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        setTelefone(formattedValue)
    }

    const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setEndereco({
            ...endereco,
            [name]: value,
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!user) return
        if (!telefone || !telefone.match(/^\(\d{2}\) \d{5}\-\d{4}$/)) {
            setErro('O campo telefone deve estar no formato (xx) xxxxx-xxxx')
            return
        }
        if (!endereco.tipoLogradouro || !endereco.nomeLogradouro || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado || !endereco.cep) {
            setErro('Todos os campos de endereço são obrigatórios')
            return
        }
        await updateCadastro(user.uid, telefone, endereco)
        setErro('')
        navigate('/dashboard')
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Informações pessoais</h1>
            <p className="mb-4">Esses dados serão utilizados para identificação e contato, além do envio do certificado</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="telefone" className="mb-2">Telefone <span className="text-red-500">*</span></label>
                        <input type="text" id="telefone" className="border border-gray-300 rounded-md p-2 w-full" value={telefone} onChange={handleTelefoneChange} required />
                    </div>
                    <div className="lg:flex items-center lg:space-x-4 w-full">
                        <div className="flex flex-col lg:w-1/4">
                            <label htmlFor="tipoLogradouro" className="mb-2">Tipo de logradouro <span className="text-red-500">*</span></label>
                            <select id="tipoLogradouro" name="tipoLogradouro" className="border border-gray-300 rounded-md p-2 w-full" value={endereco.tipoLogradouro} onChange={handleEnderecoChange} required >
                                <option value="">Selecione</option>
                                <option value="Rua">Rua</option>
                                <option value="Avenida">Avenida</option>
                                <option value="Travessa">Travessa</option>
                                <option value="Praça">Praça</option>
                                <option value="Rodovia">Rodovia</option>
                            </select>
                        </div>
                        <div className="flex flex-col lg:w-1/4">
                            <label htmlFor="nomeLogradouro" className="mb-2">Nome do logradouro <span className="text-red-500">*</span></label>
                            <input type="text" id="nomeLogradouro" name="nomeLogradouro" className="border border-gray-300 rounded-md p-2 w-full" value={endereco.nomeLogradouro} onChange={handleEnderecoChange} required />
                        </div>
                        <div className="flex flex-col lg:w-1/4">
                            <label htmlFor="numero" className="mb-2">Número <span className="text-red-500">*</span></label>
                            <input type="text" id="numero" name="numero" className="border border-gray-300 rounded-md p-2 w-full" value={endereco.numero} onChange={handleEnderecoChange} required />
                        </div>
                        <div className="flex flex-col lg:w-1/4">
                            <label htmlFor="complemento" className="mb-2">Complemento</label>
                            <input type="text" id="complemento" name="complemento" className="border border-gray-300 rounded-md p-2 w-full" value={endereco.complemento} onChange={handleEnderecoChange} />
                        </div>
                    </div>
                    <div className="lg:flex items-center lg:space-x-4">
                        <div className="flex flex-col lg:w-1/3">
                            <label htmlFor="estado" className="mb-2">Estado <span className="text-red-500">*</span></label>
                            <input type="text" id="estado" name="estado" className="border border-gray-300 rounded-md p-2 w-full" value={endereco.estado} onChange={handleEnderecoChange} required />
                        </div>
                        <div className="flex flex-col lg:w-1/3">
                            <label htmlFor="cidade" className="mb-2">Cidade <span className="text-red-500">*</span></label>
                            <input type="text" id="cidade" name="cidade" className="border border-gray-300 rounded-md p-2 w-full" value={endereco.cidade} onChange={handleEnderecoChange} required />
                        </div>
                        <div className="flex flex-col lg:w-1/3">
                            <label htmlFor="bairro" className="mb-2">Bairro <span className="text-red-500">*</span></label>
                            <input type="text" id="bairro" name="bairro" className="border border-gray-300 rounded-md p-2 w-full" value={endereco.bairro} onChange={handleEnderecoChange} required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="cep" className="mb-2">CEP <span className="text-red-500">*</span></label>
                        <input type="text" id="cep" name="cep" className="border border-gray-300 rounded-md p-2 w-full" value={endereco.cep} onChange={handleEnderecoChange} required />
                    </div>
                </div>
                {erro && <p className="text-red-500">{erro}</p>}
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-1/8">
                    Salvar
                </button>
            </form>
        </div>
    );
}
