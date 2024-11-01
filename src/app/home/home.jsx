"use client";
import React, { useRef, useState } from 'react';
import Header from '../components/Header';
import ExportToPdf from '../components/PDFGenerator';

export default function Home() {
  const nomeLocatarioRef = useRef(null);
  const cpfLocatarioRef = useRef(null);
  const enderecoImovelRef = useRef(null);
  const valorAluguelRef = useRef(null);
  const dataVencimentoRef = useRef(null);
  const periodoReferenciaRef = useRef(null);
  const nomeLocadorRef = useRef(null);
  const cpfLocadorRef = useRef(null);
  const valorCondominioRef = useRef(null);
  const valorIptuRef = useRef(null);
  const observacoesRef = useRef(null);
  
  // Refs para campos adicionais de Pix e Transferência/Depósito
  const chavePixRef = useRef(null);
  const nomeBancoPixRef = useRef(null);
  const agenciaRef = useRef(null);
  const contaRef = useRef(null);
  const nomeBancoTransfRef = useRef(null);

  const [formaPagamento, setFormaPagamento] = useState('Pix');

  // Formata valor para Real (R$)
  const formatCurrency = (value) => {
    const number = parseFloat(value.replace(/\D/g, '') / 100);
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleCurrencyChange = (ref) => {
    ref.current.value = formatCurrency(ref.current.value);
  };

  // Formatação de CPF ou CNPJ
  const formatCpfCnpj = (value) => {
    value = value.replace(/\D/g, "");
    if (value.length <= 11) {
      // CPF
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      // CNPJ
      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
  };

  const handleCpfCnpjChange = (ref) => {
    ref.current.value = formatCpfCnpj(ref.current.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const formData = {
      nomeLocatario: nomeLocatarioRef.current.value,
      cpfLocatario: cpfLocatarioRef.current.value,
      enderecoImovel: enderecoImovelRef.current.value,
      valorAluguel: parseFloat(valorAluguelRef.current.value.replace(/[^\d,-]/g, "").replace(",", ".")) || 0,
      dataVencimento: dataVencimentoRef.current.value,
      periodoReferencia: periodoReferenciaRef.current.value,
      nomeLocador: nomeLocadorRef.current.value,
      cpfLocador: cpfLocadorRef.current.value,
      formaPagamento,
      valorCondominio: parseFloat(valorCondominioRef.current.value.replace(/[^\d,-]/g, "").replace(",", ".")) || 0,
      valorIptu: parseFloat(valorIptuRef.current.value.replace(/[^\d,-]/g, "").replace(",", ".")) || 0,
      observacoes: observacoesRef.current.value,
      chavePix: formaPagamento === 'Pix' ? chavePixRef.current.value : null,
      nomeBancoPix: formaPagamento === 'Pix' ? nomeBancoPixRef.current.value : null,
      agencia: formaPagamento === 'Transferência/Depósito' ? agenciaRef.current.value : null,
      conta: formaPagamento === 'Transferência/Depósito' ? contaRef.current.value : null,
      nomeBancoTransf: formaPagamento === 'Transferência/Depósito' ? nomeBancoTransfRef.current.value : null,
    };
    
    ExportToPdf(formData);
  };

  return (
    <div>
      <Header />
      <main className="w-full h-screen flex flex-col items-center mt-8">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl min-w-[200px] grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campos Obrigatórios */}
          <div>
            <label className="block mb-2 font-semibold text-black">Nome do Locatário:*</label>
            <input ref={nomeLocatarioRef} type="text" placeholder="Nome completo do locatário" className="input-field" />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-black">CPF do Locatário:*</label>
            <input
              ref={cpfLocatarioRef}
              type="text"
              placeholder="xxx.xxx.xxx-xx"
              maxLength={11}
              className="input-field"
              onKeyUp={() => handleCpfCnpjChange(cpfLocatarioRef)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold text-black">Endereço do Imóvel:*</label>
            <input ref={enderecoImovelRef} type="text" placeholder="Endereço completo do imóvel" className="input-field" />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-black">Valor do Aluguel:*</label>
            <input
              ref={valorAluguelRef}
              type="text"
              placeholder="Valor mensal do aluguel"
              className="input-field"
              onKeyUp={() => handleCurrencyChange(valorAluguelRef)}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-black">Data de Vencimento:*</label>
            <input ref={dataVencimentoRef} type="date" className="input-field" />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-black">Período de Referência:*</label>
            <input ref={periodoReferenciaRef} type="month" className="input-field" />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-black">Nome do Locador:*</label>
            <input ref={nomeLocadorRef} type="text" placeholder="Nome completo do locador" className="input-field" />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-black">CPF/CNPJ do Locador:*</label>
            <input
              ref={cpfLocadorRef}
              maxLength={18}
              type="text"
              placeholder="CPF ou CNPJ do locador"
              className="input-field"
              onKeyUp={() => handleCpfCnpjChange(cpfLocadorRef)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold text-black">Forma de Pagamento:</label>
            <div className="flex gap-x-4 text-black">
              <label><input type="radio" name="formaPagamento" value="Dinheiro" checked={formaPagamento === 'Dinheiro'} onChange={(e) => setFormaPagamento(e.target.value)} /> Dinheiro</label>
              <label><input type="radio" name="formaPagamento" value="Pix" checked={formaPagamento === 'Pix'} onChange={(e) => setFormaPagamento(e.target.value)} /> Pix</label>
              <label><input type="radio" name="formaPagamento" value="Transferência/Depósito" checked={formaPagamento === 'Transferência/Depósito'} onChange={(e) => setFormaPagamento(e.target.value)} /> Transferência/Depósito</label>
              <label><input type="radio" name="formaPagamento" value="Cartão de Crédito/Débito" checked={formaPagamento === 'Cartão de Crédito/Débito'} onChange={(e) => setFormaPagamento(e.target.value)} /> Cartão de Crédito/Débito</label>
            </div>
          </div>

          {/* Campos Condicionais para Pix */}
          {formaPagamento === 'Pix' && (
            <>
              <div>
                <label className="block mb-2 font-semibold text-black">Chave Pix:</label>
                <input ref={chavePixRef} type="text" placeholder="Insira a chave Pix" className="input-field" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-black">Banco:</label>
                <input ref={nomeBancoPixRef} type="text" placeholder="Nome do banco" className="input-field" />
              </div>
            </>
          )}

          {/* Campos Condicionais para Transferência/Depósito */}
          {formaPagamento === 'Transferência/Depósito' && (
            <>
              <div>
                <label className="block mb-2 font-semibold text-black">Agência:</label>
                <input ref={agenciaRef} type="text" placeholder="Número da agência" className="input-field" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-black">Conta:</label>
                <input ref={contaRef} type="text" placeholder="Número da conta" className="input-field" />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-black">Banco:</label>
                <input ref={nomeBancoTransfRef} type="text" placeholder="Nome do banco" className="input-field" />
              </div>
            </>
          )}

          <div>
            <label className="block mb-2 font-semibold text-black">Valor de Condomínio (se aplicável):</label>
            <input
              ref={valorCondominioRef}
              type="text"
              placeholder="Valor do condomínio"
              className="input-field"
              onKeyUp={() => handleCurrencyChange(valorCondominioRef)}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-black">Valor de IPTU (se aplicável):</label>
            <input
              ref={valorIptuRef}
              type="text"
              placeholder="Valor do IPTU"
              className="input-field"
              onKeyUp={() => handleCurrencyChange(valorIptuRef)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold text-black">Observações:</label>
            <textarea ref={observacoesRef} placeholder="Informações adicionais" className="input-field h-24 resize-none" />
          </div>
          <div className="md:col-span-2 flex justify-center mt-4">
            <button type="submit" className="px-6 py-2 bg-[#2563eb] text-white rounded-md hover:bg-[#324672] transition duration-300">Gerar PDF</button>
          </div>
        </form>
      </main>
    </div>
  );
}
