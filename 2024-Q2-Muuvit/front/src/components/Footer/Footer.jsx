import React from 'react';
import './Footer.css';

/**
 * Footer component for the bottom of the page.
 * @returns {Element}
 */


const Footer = () => {
    return (
        <footer>
            <div id="footer">
                <div id="socialMedia">
                    <div id="github">
                        <a href="https://github.com/TVT23KM-1/Muuvit.git" target="blank">
                            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                                 alt="Github logo"/>
                            <div>Projekti Repo</div>
                        </a>
                        <br/>
                    </div>
                    <div id="tmdb">
                        <a href="https://www.themoviedb.org/" target="blank">
                            <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
                                 alt="TMDB logo"/>
                        </a>
                        <br/>
                    </div>
                </div>
                <p>© OAMK Tietotekniikan opiskelijat, 2024</p>
            </div>
        </footer>
    );
};

export default Footer;