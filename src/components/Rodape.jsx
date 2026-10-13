import corinthians from '/corinthians.png'
import razikaPfp from '/razika_pfp.png'
import './Rodape.css'

function Rodape() {
    return(
        <>
            <footer className="footer">
                <i className='bi bi-discord'></i>
                <div className='footer-flex'>
                    <img src={razikaPfp} className='razika'></img>
                    <div className="texto-container">
                        <img src={corinthians} className='img-footer'></img>
                        <h1>razika1888</h1>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Rodape