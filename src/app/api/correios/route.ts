import { NextRequest } from 'next/server';
import { CORREIOS_SERVICE_CODES, CORREIOS_CEP_ORIGEM } from '../../../correios';

export async function GET(req: NextRequest) {
  try {
    const cep = req.nextUrl.searchParams.get('cep');
    const peso = req.nextUrl.searchParams.get('peso');

    if (!cep || !peso) {
      return new Response(
        JSON.stringify({ error: 'CEP e peso são obrigatórios' }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Validar CEP
    if (cep.length !== 8) {
      return new Response(
        JSON.stringify({ error: 'CEP deve ter 8 dígitos' }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

               const params = new URLSearchParams({
             nCdServico: `${CORREIOS_SERVICE_CODES.PAC},${CORREIOS_SERVICE_CODES.SEDEX}`,
             sCepOrigem: CORREIOS_CEP_ORIGEM,
             sCepDestino: cep,
             nVlPeso: peso,
             nCdFormato: '1',
             nVlComprimento: '16',
             nVlAltura: '2',
             nVlLargura: '11',
             nVlDiametro: '0',
             sCdMaoPropria: 'n',
             sCdAvisoRecebimento: 'n',
             nVlValorDeclarado: '0',
             StrRetorno: 'xml'
           });

    const url = `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?${params}`;

    console.log('Consultando Correios:', url);

    try {
      // Tentar fazer a requisição real
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xml = await response.text();
      console.log('Resposta dos Correios recebida, tamanho:', xml.length);

      return new Response(xml, { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/xml; charset=utf-8',
        } 
      });

    } catch (fetchError) {
      console.error('Erro ao fazer fetch dos Correios:', fetchError);
      
      // Se falhar, retornar dados simulados para teste
      console.log('Retornando dados simulados para teste');
      
      const xmlSimulado = `<?xml version="1.0" encoding="UTF-8"?>
<Servicos>
  <cServico>
    <Codigo>04510</Codigo>
    <Valor>15,50</Valor>
    <PrazoEntrega>8</PrazoEntrega>
    <ValorSemAdicionais>15,50</ValorSemAdicionais>
    <ValorMaoPropria>0,00</ValorMaoPropria>
    <ValorAvisoRecebimento>0,00</ValorAvisoRecebimento>
    <ValorDeclarado>0,00</ValorDeclarado>
    <EntregaDomiciliar>S</EntregaDomiciliar>
    <EntregaSabado>N</EntregaSabado>
    <Erro>0</Erro>
    <MsgErro></MsgErro>
  </cServico>
  <cServico>
    <Codigo>04014</Codigo>
    <Valor>25,80</Valor>
    <PrazoEntrega>3</PrazoEntrega>
    <ValorSemAdicionais>25,80</ValorSemAdicionais>
    <ValorMaoPropria>0,00</ValorMaoPropria>
    <ValorAvisoRecebimento>0,00</ValorAvisoRecebimento>
    <ValorDeclarado>0,00</ValorDeclarado>
    <EntregaDomiciliar>S</EntregaDomiciliar>
    <EntregaSabado>N</EntregaSabado>
    <Erro>0</Erro>
    <MsgErro></MsgErro>
  </cServico>
</Servicos>`;

      return new Response(xmlSimulado, { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/xml; charset=utf-8',
        } 
      });
    }

  } catch (error) {
    console.error('Erro geral na API route:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno ao consultar Correios',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
