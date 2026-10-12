import { useState } from 'react';
import './CardMusica.css';

/*
  Formato esperado de `musica`:
  {
    id: number,
    titulo: string,
    artista: string,
    capa: string,      // URL da imagem
    duracao: number,   // em segundos
    genero: string,
  }

  Props opcionais:
  ativa        — esta é a faixa carregada no player?
  tocando      — a faixa ativa está tocando (e não pausada)?
  tempoAtual   — posição atual, em segundos (só faz sentido se `ativa`)
  aleatorio, repetir — estado dos botões de shuffle / repeat
  onPlay, onPrevious, onNext, onSeek, onToggleAleatorio, onToggleRepetir
*/

function formatarTempo(segundos) {
  const total = Math.max(0, Math.floor(segundos));
  const minutos = Math.floor(total / 60);
  const resto = total % 60;

  return `${minutos}:${String(resto).padStart(2, '0')}`;
}

function CardMusica({
  musica,
  ativa = false,
  tocando = false,
  tempoAtual = 0,
  aleatorio = false,
  repetir = false,
  onPlay,
  onPrevious,
  onNext,
  onSeek,
  onToggleAleatorio,
  onToggleRepetir,
}) {
  const [favorita, setFavorita] = useState(false);

  const reproduzindo = ativa && tocando;
  const progresso =
    musica.duracao > 0
      ? Math.min(tempoAtual / musica.duracao, 1) * 100
      : 0;

  function buscarNaBarra(e) {
    if (!ativa) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const proporcao = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1,
    );

    onSeek?.(musica, Math.round(proporcao * musica.duracao));
  }

  function buscarComTeclado(e) {
    if (!ativa) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onSeek?.(musica, Math.min(tempoAtual + 5, musica.duracao));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onSeek?.(musica, Math.max(tempoAtual - 5, 0));
    }
  }

  return (
    <div className={`music-card${ativa ? ' music-card--ativa' : ''}`}>
      <div className="music-header">
        <img
          className="music-cover"
          src={musica.capa}
          alt={`Capa de ${musica.titulo}`}
        />

        <div className="music-info">
          <div className="music-title-row">
            <div className="music-title" title={musica.titulo}>
              {musica.titulo}
            </div>

            {reproduzindo && (
              <span className="music-eq" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
          </div>

          <div className="music-artist">{musica.artista}</div>
        </div>

        <div className="music-actions">
          <button
            type="button"
            className={`music-icon favorite-icon${favorita ? ' active' : ''}`}
            onClick={() => setFavorita((atual) => !atual)}
            aria-pressed={favorita}
            aria-label={favorita ? 'Desfavoritar' : 'Favoritar'}
          >
            <i className={`bi ${favorita ? 'bi-heart-fill' : 'bi-heart'}`} />
          </button>

          <button
            type="button"
            className="music-icon"
            aria-label="Adicionar à fila"
          >
            <i className="bi bi-plus-circle" />
          </button>

          <button type="button" className="music-icon" aria-label="Mais opções">
            <i className="bi bi-list" />
          </button>
        </div>
      </div>

      <div className="music-controls">
        <button
          type="button"
          className={`control-button${aleatorio ? ' on' : ''}`}
          onClick={onToggleAleatorio}
          aria-pressed={aleatorio}
          aria-label="Aleatório"
        >
          <i className="bi bi-shuffle" />
        </button>

        <button
          type="button"
          className="control-button"
          onClick={() => onPrevious?.(musica)}
          aria-label="Faixa anterior"
        >
          <i className="bi bi-skip-start-fill" />
        </button>

        <button
          type="button"
          className="play-button"
          onClick={() => onPlay?.(musica)}
          aria-label={
            reproduzindo
              ? `Pausar ${musica.titulo}`
              : `Reproduzir ${musica.titulo}`
          }
        >
          <i className={`bi ${reproduzindo ? 'bi-pause-fill' : 'bi-play-fill'}`} />
        </button>

        <button
          type="button"
          className="control-button"
          onClick={() => onNext?.(musica)}
          aria-label="Próxima faixa"
        >
          <i className="bi bi-skip-end-fill" />
        </button>

        <button
          type="button"
          className={`control-button${repetir ? ' on' : ''}`}
          onClick={onToggleRepetir}
          aria-pressed={repetir}
          aria-label="Repetir"
        >
          <i className="bi bi-repeat" />
        </button>
      </div>

      <div className="music-progress">
        <span className="music-time">
          {formatarTempo(ativa ? tempoAtual : 0)}
        </span>

        <div
          className={`music-progress-track${ativa ? ' is-seekable' : ''}`}
          role="slider"
          aria-label="Progresso da faixa"
          aria-disabled={!ativa}
          aria-valuemin={0}
          aria-valuemax={musica.duracao}
          aria-valuenow={ativa ? Math.floor(tempoAtual) : 0}
          aria-valuetext={`${formatarTempo(ativa ? tempoAtual : 0)} de ${formatarTempo(musica.duracao)}`}
          tabIndex={ativa ? 0 : -1}
          onClick={buscarNaBarra}
          onKeyDown={buscarComTeclado}
        >
          <div
            className="music-progress-fill"
            style={{ width: `${ativa ? progresso : 0}%` }}
          />
        </div>

        <span className="music-time">{formatarTempo(musica.duracao)}</span>
      </div>

      <div className="music-footer">
        <div className="footer-left">
          <button type="button" className="music-icon" aria-label="Playlist">
            <i className="bi bi-card-list" />
          </button>

          <button
            type="button"
            className="music-icon"
            aria-label="Fila de músicas"
          >
            <i className="bi bi-music-note-list" />
          </button>
        </div>

        <div className="footer-right">
          <button type="button" className="music-icon" aria-label="Mini player">
            <i className="bi bi-pip" />
          </button>

          <button type="button" className="music-icon" aria-label="Volume">
            <i className="bi bi-volume-up" />
          </button>

          <button type="button" className="music-icon" aria-label="Expandir">
            <i className="bi bi-arrows-angle-expand" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardMusica;