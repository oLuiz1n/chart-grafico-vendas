import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend} from 'chart.js';

ChartJS.register(LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend);


const BarChart = () => {
    const [arrVendasMensais, setArrVendasMensais] = useState([]);
    const [verPorDia, setVerPorDia] = useState(false);
    const [mes, setMes] = useState("");
    const [ano, setAno] = useState("");
    const [anosDisponiveis, setAnosDisponiveis] = useState([]);
    const [mesesDisponiveis, setMesesDisponiveis] = useState([]);
    const [metrica, setMetrica] = useState("valor");
    const nomesMeses = ["Janeiro","Fevereiro","Março","Abril","Maio",
    "Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

useEffect(() => {
    const pegarInfosAPI = async () => {
        try {
            const respostaFetch = await fetch("http://localhost:3000/vendas");
            const jsonRespostaFetch = await respostaFetch.json();

            const anos = Array.from(
                new Set(jsonRespostaFetch.map(v => new Date(v.data).getFullYear()))
                ).sort((a, b) => b - a);
                setAnosDisponiveis(anos);

            const meses = Array.from(
                new Set(jsonRespostaFetch.map(v => new Date(v.data).getMonth() + 1))
                ).sort((a, b) => a - b);
                setMesesDisponiveis(meses);

            let dadosFiltrados = jsonRespostaFetch.filter(v => {
                const data = new Date(v.data);
                const m = data.getMonth() + 1;
                const a = data.getFullYear();

                 if (mes && ano) {
                    return m === Number(mes) && a === Number(ano);
                } else if (mes) {
                    return m === Number(mes);
                } else if (ano) {
                    return a === Number(ano);
                }
                return true;
            });

            const agrupado = {};
            dadosFiltrados.forEach(v => {
                const data = new Date(v.data);
                const m = data.getMonth() + 1;
                const a = data.getFullYear();
                const d = data.getDate();
                let key;

                if(verPorDia) {
                    key = `${a}/${m}/${d}`;
                }else{
                    key = `${a}/${m}`;
                };

                if(!agrupado[key]) {
                        agrupado[key] = { totalValor: 0, quantidade: 0 };
                    }

                    agrupado[key].totalValor += v.valor;
                    agrupado[key].quantidade += 1;

                });

            const dadosFormatados = Object.keys(agrupado).map(key => ({
                mes: verPorDia ? key : `Mês ${key}`,
                valorVendido: agrupado[key].totalValor,
                quantidade: agrupado[key].quantidade
            }));

            setArrVendasMensais(dadosFormatados);

        } catch (error) {
            console.log("Deu erro", error);
        }
    };

    pegarInfosAPI();
}, [mes, ano, verPorDia]);
    
const data = {
    labels: arrVendasMensais.map(v => v.mes),
    datasets: [
        {
            label: 'Vendas',
            data: arrVendasMensais.map(v => metrica === "valor" ? v.valorVendido : v.quantidade),
            backgroundColor: "rgb(185, 185, 185)",
        },
    ],
};


return (

    <div>
        <select value={mes} onChange={(e) => setMes(e.target.value)}>
            <option value="">todos os meses</option>
            {mesesDisponiveis.map(m => (
                <option key={m} value={m}>{nomesMeses[m-1]}</option>
            ))}
        </select>

        <select value={ano} onChange={(e) => setAno(e.target.value)}>
            <option value="">Todos os anos</option>
            {anosDisponiveis.map(a => (
            <option key={a} value={a}>{a}</option>
            ))}
        </select>

        <select value={metrica} onChange={(e) => setMetrica(e.target.value)}>
            <option value="valor">Valor Total</option>
            <option value="quantidade">Quantidade de Vendas</option>
        </select>

        <select value={verPorDia} onChange={(e) => setVerPorDia(e.target.value === "true")}>
            <option value="false">Ver por mês</option>
            <option value="true">Ver por dia</option>
        </select>

        <Bar key={mes + ano + metrica} data={data} />;
      </div>
    );  
};

export default BarChart;
