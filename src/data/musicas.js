/* --------------------------------------------------------------------------
   Capas geradas em SVG (funcionam offline). Troque por URLs reais quando
   tiver as imagens.
   -------------------------------------------------------------------------- */
function gerarCapa(matizA, matizB) {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='hsl(${matizA}, 80%, 56%)'/>
          <stop offset='1' stop-color='hsl(${matizB}, 75%, 28%)'/>
        </linearGradient>
      </defs>
      <rect width='200' height='200' fill='url(#g)'/>
      <circle cx='100' cy='100' r='64' fill='none' stroke='white' stroke-opacity='.25' stroke-width='2'/>
      <circle cx='100' cy='100' r='44' fill='none' stroke='white' stroke-opacity='.2' stroke-width='2'/>
      <circle cx='100' cy='100' r='10' fill='white' fill-opacity='.85'/>
    </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const musicas = [
  { 
    id: 1,
    titulo: 'I Wanna Be Your Lover (Single Version)',
    artista: 'Prince',
    genero: 'Funk',
    duracao: 181, capa: "https://m.media-amazon.com/images/I/91wN0rwrjCL._UF1000,1000_QL80_.jpg",
    audio: '/audios/i-wanna-be-your-lover.mp3'
  },
  { 
    id: 2,
    titulo: "Lovely Day",
    artista: "Bill Withers",
    genero: "R&B",
    duracao: 255,
    capa: "https://cdn-images.dzcdn.net/images/cover/2b706158a66dee36b7eb874eb013dc48/0x1900-000000-80-0-0.jpg",
    audio: '/audios/lovely-day.mp3'
  },
  { 
    id: 3, 
    titulo: "Dreams", 
    artista: "Fleetwood Mac", 
    genero: "Rock", 
    duracao: 258, 
    capa: "https://i.scdn.co/image/ab67616d0000b2735e66bc0df2bd18e746dbb823", 
    audio: '/audios/dreams.m4a'
  },
  { 
    id: 4, 
    titulo: "Johnny B. Goode", 
    artista: "Chuck Berry", 
    genero: "Rock", 
    duracao: 162, 
    capa: "https://m.media-amazon.com/images/I/71DFIo6p8GL._UF1000,1000_QL80_.jpg",
    audio: '/audios/johnny-b-goode.m4a'
  },
  { 
    id: 5, 
    titulo: "Crocodile Rock", 
    artista: "Elton John", 
    genero: "Rock", 
    duracao: 236, 
    capa: "https://upload.wikimedia.org/wikipedia/pt/a/a3/Elton_John_-_1973_-_Don%27t_Shoot_Me_I%27m_Only_the_Piano_Player.jpg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
    audio: '/audios/crocodile-rock.m4a'
  },
  { 
    id: 6, 
    titulo: "Isn't She Lovely", 
    artista: "Stevie Wonder", 
    genero: "R&B", 
    duracao: 200, 
    capa: "https://upload.wikimedia.org/wikipedia/pt/b/b2/Songs_in_the_Key_of_Life.jpg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
    audio: '/audios/isnt-she-lovely.m4a'
  },
  { 
    id: 7, 
    titulo: "Don't Stop 'Til You Get Enough", 
    artista: "Michael Jackson", 
    genero: "Funk", 
    duracao: 366, 
    capa: "https://m.media-amazon.com/images/I/812EgYpATnL.jpg",
    audio: '/audios/dont-stop-till-get-enough.m4a'
  },
  { 
    id: 8, 
    titulo: "Faz Mais uma Vez Comigo", 
    artista: "Zezé Di Camargo & Luciano", 
    genero: "Sertanejo", duracao: 252, 
    capa: "https://cdn.immub.org/capas/7179/thumbnails/m_7179ca.jpg",
    audio: '/audios/faz-mais-uma-vez-comigo.m4a'
  }
];

export default musicas;