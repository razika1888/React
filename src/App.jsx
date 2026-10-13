import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import './App.css';

// COMPONENTES
import CardMusica from './components/CardMusica';
import Rodape from './components/Rodape';

// BIBLIOTECA DE MÚSICAS
import musicas from './data/musicas';

// IMAGENS
import outbreakLogo from '/outbreak_1.png';

const GENEROS = [
  'Todos',
  ...Array.from(new Set(musicas.map((m) => m.genero))),
];

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function App() {
  const audioRef = useRef(null);

  const [busca, setBusca] = useState('');
  const [genero, setGenero] = useState('Todos');

  // Estado real do player
  const [atualId, setAtualId] = useState(null);
  const [tocando, setTocando] = useState(false);
  const [tempo, setTempo] = useState(0);

  const [aleatorio, setAleatorio] = useState(false);
  const [repetir, setRepetir] = useState(false);
  const [volume, setVolume] = useState(0.3);

  // Filtragem da biblioteca
  const filtradas = useMemo(() => {
    const termo = normalizar(busca.trim());

    return musicas.filter((m) => {
      const bateGenero =
        genero === 'Todos' || m.genero === genero;

      const bateBusca =
        termo === '' ||
        normalizar(m.titulo).includes(termo) ||
        normalizar(m.artista).includes(termo);

      return bateGenero && bateBusca;
    });
  }, [busca, genero]);

  // Música atualmente selecionada
  const atual = useMemo(
    () => musicas.find((m) => m.id === atualId) ?? null,
    [atualId],
  );

  // Cria o player e acompanha o tempo real do áudio
  useEffect(() => {
    const audio = new Audio();

    audio.preload = 'metadata';
    audio.volume = 0.7;

    audioRef.current = audio;

    function atualizarTempo() {
      setTempo(audio.currentTime);
    }

    function aoIniciar() {
      setTocando(true);
    }

    function aoPausar() {
      setTocando(false);
    }

    audio.addEventListener('timeupdate', atualizarTempo);
    audio.addEventListener('play', aoIniciar);
    audio.addEventListener('pause', aoPausar);

    return () => {
      audio.pause();

      audio.removeEventListener('timeupdate', atualizarTempo);
      audio.removeEventListener('play', aoIniciar);
      audio.removeEventListener('pause', aoPausar);

      audioRef.current = null;
    };
  }, []);

  // Sincroniza o volume com o player
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Efeito de Radio no Console
  useEffect(() => {
    console.log(
      "%c" +
      "╔══════════════════════════════════════════╗\n" +
      "║                                          ║\n" +
      "║                                          ║\n" +
      "║        O U T B R E A K   a n d           ║\n" +
      "║       RAYMOND THOMPSON PRESENTS          ║\n" +
      "║                                          ║\n" +
      "║                                          ║\n" +
      "╚══════════════════════════════════════════╝",
      "color: #e5c46a; background: #171717; font-family: monospace; font-weight: bold;"
    );

    console.log(
      "%c📻  RT RADIO  |  FREQUÊNCIA 98.6 FM",
      "color: #e5c46a; background: #252525; padding: 8px 12px; font-size: 14px; font-weight: bold;"
    );

    console.log(
      "%c▶  TRANSMISSÃO INICIADA",
      "color: #71d6a0; font-weight: bold; font-size: 12px;"
    );

    console.log(
      "%cVocê está ouvindo a playlist feita a dedo por Raymond Thompson.",
      "color: #eeeeee; font-size: 13px; font-style: italic;"
    );

    console.log(
      "%c♪  Uma seleção pessoal. Uma frequência particular.",
      "color: #a7a7a7; font-size: 11px;"
    );

    console.log(
      "%c[ SISTEMA ] %cPlaylist carregada. Aproveite a transmissão.",
      "color: #e5c46a; font-weight: bold;",
      "color: #71d6a0;"
    );
  }, []);

  // Reproduz uma música ou pausa a música atual
  const tocarFaixa = useCallback(async (musica) => {
    const audio = audioRef.current;

    if (!audio || !musica?.audio) {
      console.error(
        'Esta faixa não possui um caminho de áudio válido:',
        musica?.titulo,
      );
      return;
    }

    // A mesma faixa foi selecionada novamente
    if (musica.id === atualId) {
      if (!audio.paused) {
        audio.pause();
        return;
      }

      try {
        await audio.play();
      } catch (erro) {
        console.error('Não foi possível reproduzir:', erro);
      }

      return;
    }

    // Troca de faixa
    audio.pause();

    audio.src = musica.audio;
    audio.currentTime = 0;

    setAtualId(musica.id);
    setTempo(0);

    try {
      await audio.play();
    } catch (erro) {
      setTocando(false);
      console.error(
        `Não foi possível reproduzir "${musica.titulo}":`,
        erro,
      );
    }
  }, [atualId]);

  // Navegação entre as músicas
  const irPara = useCallback((origem, direcao) => {
    const total = filtradas.length;

    if (total === 0) {
      audioRef.current?.pause();
      setTocando(false);
      return;
    }

    let alvo;

    if (aleatorio && direcao === 1 && total > 1) {
      const outras = filtradas.filter(
        (m) => m.id !== origem.id,
      );

      alvo = outras[
        Math.floor(Math.random() * outras.length)
      ];
    } else {
      const indice = filtradas.findIndex(
        (m) => m.id === origem.id,
      );

      const proximo =
        indice === -1
          ? direcao === 1
            ? 0
            : total - 1
          : (indice + direcao + total) % total;

      alvo = filtradas[proximo];
    }

    tocarFaixa(alvo);
  }, [filtradas, aleatorio, tocarFaixa]);

  // Ao terminar a faixa, repete ou avança
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    function aoTerminar() {
      if (!atual) return;

      if (repetir) {
        audio.currentTime = 0;

        audio.play().catch((erro) => {
          setTocando(false);
          console.error('Erro ao repetir a faixa:', erro);
        });
      } else {
        irPara(atual, 1);
      }
    }

    audio.addEventListener('ended', aoTerminar);

    return () => {
      audio.removeEventListener('ended', aoTerminar);
    };
  }, [atual, repetir, irPara]);

  // Botão Play/Pause do card
  function handlePlay(musica) {
    tocarFaixa(musica);
  }

  // Faixa anterior
  function handlePrevious(musica) {
    const audio = audioRef.current;

    if (
      musica.id === atualId &&
      audio &&
      audio.currentTime > 3
    ) {
      audio.currentTime = 0;
      setTempo(0);
      return;
    }

    irPara(musica, -1);
  }

  // Busca na barra de progresso
  function handleSeek(musica, segundos) {
    const audio = audioRef.current;

    if (!audio || musica.id !== atualId) return;

    const limite = Number.isFinite(audio.duration)
      ? audio.duration
      : musica.duracao;

    audio.currentTime = Math.max(
      0,
      Math.min(segundos, limite),
    );

    setTempo(audio.currentTime);
  }

  return (
    <>
      <main className="app">
        <header className="app-header">
          <div className="outbreak-flex">
            <img
              src={outbreakLogo}
              alt="Outbreak Logo"
              className="outbreak"
            />

            <h2>☭ Outbreak, 1987</h2>
          </div>

          <h1 className="app-title">
            Biblioteca Musical
            <p className="personagem">
              Raymond Thompson
            </p>
          </h1>

          <p className="app-subtitle">
            {filtradas.length === musicas.length
              ? `${musicas.length} faixas na coleção`
              : `${filtradas.length} de ${musicas.length} faixas`}
          </p>
        </header>

        <section
          className="toolbar"
          aria-label="Busca e filtros"
        >
          <label className="search">
            <span className="sr-only">
              Buscar por título ou artista
            </span>

            <i
              className="bi bi-search"
              aria-hidden="true"
            />

            <input
              type="search"
              placeholder="Buscar por título ou artista"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </label>

          <div
            className="chips"
            role="group"
            aria-label="Filtrar por gênero"
          >
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
                  <strong>{atual.titulo}</strong>
                  {' · '}
                  {atual.artista}
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
                <li
                  key={musica.id}
                  style={{ '--i': indice }}
                >
                  <CardMusica
                    musica={musica}
                    ativa={ativa}
                    tocando={tocando}
                    tempoAtual={ativa ? tempo : 0}
                    aleatorio={aleatorio}
                    repetir={repetir}
                    volume={volume}
                    onVolumeChange={setVolume}
                    onPlay={handlePlay}
                    onPrevious={handlePrevious}
                    onNext={(m) => irPara(m, 1)}
                    onSeek={handleSeek}
                    onToggleAleatorio={() =>
                      setAleatorio((v) => !v)
                    }
                    onToggleRepetir={() =>
                      setRepetir((v) => !v)
                    }
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty">
            <i
              className="bi bi-search-heart"
              aria-hidden="true"
            />

            <strong>Nenhuma faixa encontrada</strong>

            <span>
              Tente outro termo ou escolha outro gênero.
            </span>
          </div>
        )}
      </main>

      <Rodape />
    </>
  );
}

export default App;