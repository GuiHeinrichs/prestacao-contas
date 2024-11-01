"use client";
import React from 'react';
import { jsPDF } from 'jspdf';

const ExportToPdf = (data) => {
  // Conversão dos valores para números antes de somar
  const valorAluguel = parseFloat(data.valorAluguel) || 0;
  const valorCondominio = parseFloat(data.valorCondominio) || 0;
  const valorIptu = parseFloat(data.valorIptu) || 0;
  const valorTotalFinal = valorAluguel + valorCondominio + valorIptu;

  // Função para formatar a data de vencimento (DD/MM/YYYY)
  const formatDataVencimento = (dataString) => {
    if (!dataString) return "Não inserida.";
    const dataObj = new Date(dataString);
    return dataObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  // Função para formatar o período de referência (mês de ano)
  const formatPeriodoReferencia = (dataString) => {
    if (!dataString) return "Não inserida.";
    const [year, month] = dataString.split("-");
    const meses = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
    return `${meses[parseInt(month, 10) - 1]} de ${year}`;
  };

  const doc = new jsPDF();

  // Título em preto
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);  // Preto
  doc.text("Cobrança de Aluguel", 105, 20, { align: "center" });

  // Valor total destacado em verde
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 128, 0);  // Verde
  doc.text(`Total a Pagar: R$ ${valorTotalFinal.toFixed(2)}`, 180, 30, { align: "right" });

  // Quadro para informações gerais com quebra de linha e ajuste de altura
  doc.setTextColor(0, 0, 0); // Preto para o texto do quadro
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  let y = 50;
  const textWidth = 180;

  // Dividir o texto em linhas e calcular a altura dinâmica do quadro
  const nomeLocatarioText = doc.splitTextToSize(`Prezado(a) ${data.nomeLocatario},`, textWidth);
  const enderecoImovelText = doc.splitTextToSize(
    `Segue a cobrança de aluguel referente ao imóvel localizado em: ${data.enderecoImovel}.`,
    textWidth
  );

  const boxHeight = (nomeLocatarioText.length + enderecoImovelText.length) * 10 + 5; // Altura baseada no número de linhas
  doc.setDrawColor(200);
  doc.roundedRect(10, y, 190, boxHeight, 3, 3);  // Quadro arredondado

  // Exibir texto com ajuste dinâmico
  doc.text(nomeLocatarioText, 15, y + 10);
  doc.text(enderecoImovelText, 15, y + 20 + (nomeLocatarioText.length - 1) * 10);
  y += boxHeight + 5; // Ajuste final com espaço extra

  // Informações do Locador
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Locador: ${data.nomeLocador} - CPF/CNPJ: ${data.cpfLocador}`, 15, y);

  // Quadro para detalhamento dos valores
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(240, 240, 240);  // Fundo cinza claro
  doc.roundedRect(10, y, 190, 30, 3, 3, "F");  // Quadro arredondado preenchido
  doc.text("Detalhamento dos Valores:", 15, y + 8);
  doc.setFont("helvetica", "normal");
  y += 15;
  doc.text(`- Valor do Aluguel: R$ ${valorAluguel.toFixed(2)}`, 12, y);
  y += 7;
  if (valorCondominio > 0) {
    doc.text(`- Valor do Condomínio: R$ ${valorCondominio.toFixed(2)}`, 12, y);
    y += 7;
  }
  if (valorIptu > 0) {
    doc.text(`- Valor do IPTU: R$ ${valorIptu.toFixed(2)}`, 12, y);
    y += 7;
  }

  // Datas formatadas com destaque em cinza
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(128, 128, 128);  // Cinza
  doc.text(`Data de Vencimento: ${formatDataVencimento(data.dataVencimento)}`, 11, y);
  y += 10;
  doc.text(`Período de Referência: ${formatPeriodoReferencia(data.periodoReferencia)}`, 11, y);

  // Determinar altura do quadro de Informações de Pagamento com base no conteúdo
  y += 15;
  let paymentBoxHeight = 15; // Altura mínima para o título
  if (data.formaPagamento === 'Pix') {
    paymentBoxHeight += data.chavePix ? 10 : 0;
    paymentBoxHeight += data.nomeBancoPix ? 10 : 0;
  } else if (data.formaPagamento === 'Transferência/Depósito') {
    paymentBoxHeight += data.agencia ? 10 : 0;
    paymentBoxHeight += data.conta ? 10 : 0;
    paymentBoxHeight += data.nomeBancoTransf ? 10 : 0;
  }

  // Quadro para Informações de Pagamento
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);  // Preto
  doc.setFillColor(220, 240, 220);  // Fundo verde claro
  doc.roundedRect(10, y, 190, paymentBoxHeight, 3, 3, "F");  // Quadro arredondado preenchido
  doc.text("Informações de Pagamento:", 15, y + 8);
  doc.setFont("helvetica", "normal");
  y += 15;

  // Conteúdo do quadro Informações de Pagamento
  if (data.formaPagamento === 'Pix') {
    if (data.chavePix) {
      doc.text(`- Chave Pix: ${data.chavePix}`, 15, y);
      y += 10;
    }
    if (data.nomeBancoPix) {
      doc.text(`- Banco: ${data.nomeBancoPix}`, 15, y);
      y += 10;
    }
  } else if (data.formaPagamento === 'Transferência/Depósito') {
    if (data.agencia) {
      doc.text(`- Agência: ${data.agencia}`, 15, y);
      y += 10;
    }
    if (data.conta) {
      doc.text(`- Conta: ${data.conta}`, 15, y);
      y += 10;
    }
    if (data.nomeBancoTransf) {
      doc.text(`- Banco: ${data.nomeBancoTransf}`, 15, y);
      y += 10;
    }
  }

  // Observações gerais sem borda
  y += 10;
  if (data.observacoes) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text("Observações:", 10, y);
    y += 10;
    const observacoesText = doc.splitTextToSize(data.observacoes, 180);
    doc.setFont("helvetica", "normal");
    doc.text(observacoesText, 10, y);
    y += observacoesText.length * 5;
  }

  // Data de emissão no rodapé
  y += 20;
  const dataAtual = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);
  doc.text(`Emitido em: ${dataAtual}`, 10, y);

  // Salva o PDF com o nome "prestacao_contas.pdf"
  doc.save("prestacao_contas.pdf");

  return (
    <button onClick={() => ExportToPdf(data)}>Gerar PDF</button>
  );
};

export default ExportToPdf;
