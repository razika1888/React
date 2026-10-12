import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

// COMPONENTES
import CardMusica from './components/CardMusica';
import Rodape from './components/Rodape';

// Biblioteca de Musicas
import musicas from './data/musicas';

// Imagens
import outbreakLogo from '../public/outbreak_1.png'

const GENEROS = ['Todos', ...Array.from(new Set(musicas.map((m) => m.genero)))];

/** Minúsculas e sem acento, para a busca ignorar "é" vs "e". */
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function App() {
  const [busca, setBusca] = useState('');
  const [genero, setGenero] = useState('Todos');

  // Estado do player (simulado: não há áudio de verdade)
  const [atualId, setAtualId] = useState(null);
  const [tocando, setTocando] = useState(false);
  const [tempo, setTempo] = useState(0);
  const [aleatorio, setAleatorio] = useState(false);
  const [repetir, setRepetir] = useState(false);

  const filtradas = useMemo(() => {
    const termo = normalizar(busca.trim());

    return musicas.filter((m) => {
      const bateGenero = genero === 'Todos' || m.genero === genero;
      const bateBusca =
        termo === '' ||
        normalizar(m.titulo).includes(termo) ||
        normalizar(m.artista).includes(termo);

      return bateGenero && bateBusca;
    });
  }, [busca, genero]);

  const atual = useMemo(
    () => musicas.find((m) => m.id === atualId) ?? null,
    [atualId],
  );

  const tocarFaixa = useCallback((musica) => {
    setAtualId(musica.id);
    setTempo(0);
    setTocando(true);
  }, []);

  const irPara = useCallback(
    (origem, direcao) => {
      const total = filtradas.length;

      if (total === 0) {
        setTocando(false);
        return;
      }

      let alvo;

      if (aleatorio && direcao === 1 && total > 1) {
        const outras = filtradas.filter((m) => m.id !== origem.id);
        alvo = outras[Math.floor(Math.random() * outras.length)];
      } else {
        const indice = filtradas.findIndex((m) => m.id === origem.id);
        const proximo =
          indice === -1
            ? direcao === 1
              ? 0
              : total - 1
            : (indice + direcao + total) % total;

        alvo = filtradas[proximo];
      }

      tocarFaixa(alvo);
    },
    [filtradas, aleatorio, tocarFaixa],
  );

  // Relógio do player: avança 1s por segundo enquanto toca
  useEffect(() => {
    if (!tocando || atualId === null) return;

    const intervalo = window.setInterval(() => setTempo((t) => t + 1), 1000);
    return () => window.clearInterval(intervalo);
  }, [tocando, atualId]);

  // Fim da faixa: repete ou segue para a próxima
  useEffect(() => {
    if (!atual || tempo < atual.duracao) return;

    if (repetir) {
      setTempo(0);
    } else {
      irPara(atual, 1);
    }
  }, [tempo, atual, repetir, irPara]);

  function handlePlay(musica) {
    if (musica.id === atualId) {
      setTocando((t) => !t);
    } else {
      tocarFaixa(musica);
    }
  }

  function handlePrevious(musica) {
    // Como nos players de verdade: depois de 3s, "anterior" volta ao início
    if (musica.id === atualId && tempo > 3) {
      setTempo(0);
      return;
    }

    irPara(musica, -1);
  }

  function handleSeek(musica, segundos) {
    if (musica.id === atualId) setTempo(segundos);
  }

  return (
    <>
      <main className="app">
        <header className="app-header">

          <div className='outbreak-flex'>
            <img src={outbreakLogo} alt='Outbreak Logo' className='outbreak'></img>
            <h2>☭ Outbreak, 1987</h2>
          </div>
          <h1 className="app-title">Biblioteca Musical <p className='personagem'>Raymond Thompson</p></h1>

          <p className="app-subtitle">
            {filtradas.length === musicas.length
              ? `${musicas.length} faixas na coleção`
              : `${filtradas.length} de ${musicas.length} faixas`}
          </p>
        </header>

        <section className="toolbar" aria-label="Busca e filtros">
          <label className="search">
            <span className="sr-only">Buscar por título ou artista</span>
            <i className="bi bi-search" aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar por título ou artista"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </label>

          <div className="chips" role="group" aria-label="Filtrar por gênero">
            {GENEROS.map((g) => (
              <button
                key={g}
                type="button"
                className={`chip${g === genero ? ' active' : ''}`}
                aria-pressed={g === genero}
                onClick={() => setGenero(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <p className="now-playing" aria-live="polite">
            <i
              className={`bi ${atual
                  ? tocando
                    ? 'bi-volume-up-fill'
                    : 'bi-pause-fill'
                  : 'bi-music-note'
                }`}
              aria-hidden="true"
            />
            <span className="now-playing-text">
              {atual ? (
                <>
                  <strong>{atual.titulo}</strong> · {atual.artista}
                </>
              ) : (
                'Escolha uma faixa para começar'
              )}
            </span>
          </p>
        </section>

        {filtradas.length > 0 ? (
          <ul className="library-grid">
            {filtradas.map((musica, indice) => {
              const ativa = musica.id === atualId;

              return (
                <li key={musica.id} style={{ '--i': indice }}>
                  <CardMusica
                    musica={musica}
                    ativa={ativa}
                    tocando={tocando}
                    tempoAtual={ativa ? tempo : 0}
                    aleatorio={aleatorio}
                    repetir={repetir}
                    onPlay={handlePlay}
                    onPrevious={handlePrevious}
                    onNext={(m) => irPara(m, 1)}
                    onSeek={handleSeek}
                    onToggleAleatorio={() => setAleatorio((v) => !v)}
                    onToggleRepetir={() => setRepetir((v) => !v)}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty">
            <i className="bi bi-search-heart" aria-hidden="true" />
            <strong>Nenhuma faixa encontrada</strong>
            <span>Tente outro termo ou escolha outro gênero.</span>
          </div>
        )}
      </main>
      
      <Rodape />
    </>
  );
}

export default App;