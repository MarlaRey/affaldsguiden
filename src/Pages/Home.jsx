import React, { useState, useEffect, useRef } from 'react'; 
// useState bruges til at håndtere komponentens lokale state.
// useEffect bruges til at køre side-effekter, fx at hente data.
// useRef bruges til at skabe mutable referencer, som ikke trigger en re-render.

import supabase from '../../supabase'; 
import styles from './Home.module.scss'; 
import malerspandeImg from '../assets/img/malerspande.jpg';
import affaldSkovImg from '../assets/img/affald-skov-1.jpg';
import iconPilHojre from '../assets/img/Icon PilHojre.png';
import tipsOgTricksImg from '../assets/img/tips-og-tricks.jpg';

const Home = () => {
    // useState hooks bruges her til at gemme fetched data fra Supabase.
    const [news, setNews] = useState([]); // Gemmer nyhedsartikler.
    const [article, setArticle] = useState(null); // Gemmer én specifik artikel.
    const [tips, setTips] = useState(null); // Gemmer en artikel med tips.

    // useRef hooks bruges til at gemme referencer til DOM-elementer (h3-titler og en h2-titel), som ikke trigger genrendringer, når de ændres.
    const titlesRef = useRef([]); // Array af referencer til nyhedssektionens h3-titler.
    const tipsTitleRef = useRef(null); // Ref til h2-titlen i tips-sektionen.

    useEffect(() => {
        // useEffect hook som kører efter første render og når news eller tips ændres.
        // Heri manipuleres DOM'en for at style titler dynamisk baseret på antal ord i titlerne.

        // Funktion til at formatere h3-titel-elementer i nyhedssektionen.
        titlesRef.current.forEach((titleEl) => {
            if (titleEl) { // Tjekker om referencen eksisterer.
                const words = titleEl.innerText.split(' '); // Splitter titlen i ord.
                if (words.length > 1) { // Hvis der er mere end ét ord i titlen.
                    // Opdaterer innerHTML med et specielt style på det første ord og resten af titlen.
                    //words.slice(1) tager alle ordene efter det første (i vores eksempel ['spændende', 'artikel']). Metoden .slice(1) starter fra indeks 1 (det andet ord) og går til slutningen af arrayet.
                    //Derefter bruger vi .join(' ') for at sætte disse ord sammen igen til en streng, hvor hvert ord adskilles af et mellemrum. Dette sikrer, at vi ikke mister mellemrum mellem ordene, når vi sætter dem tilbage.
                    //Resten af ordene omsluttes af et andet <span>-element med en anden CSS-klasse (styles.restOfTitle). På den måde kan vi style resten af titlen anderledes end det første ord.
                    titleEl.innerHTML = `<span class="${styles.firstWord}">${words[0]}</span> <span class="${styles.restOfTitle}">${words.slice(1).join(' ')}</span>`;
                }
            }
        });

        // Funktion til at formatere h2-titlen i tips-sektionen.
        if (tipsTitleRef.current) {
            const tipsWords = tipsTitleRef.current.innerText.split(' '); // Splitter h2-titlen i ord.
            if (tipsWords.length >= 3) { // Hvis titlen har mindst 3 ord.
                const firstThreeWords = tipsWords.slice(0, 3).join(' '); // De første tre ord i titlen.
                const restOfTitle = tipsWords.slice(3).join(' '); // Resten af titlen.
                // Opdaterer innerHTML med de første tre ord i en speciel style.
                tipsTitleRef.current.innerHTML = `<span class="${styles.firstWord}">${firstThreeWords}</span> <span class="${styles.restOfTitle}">${restOfTitle}</span>`;
            } else {
                // Hvis der er færre end tre ord, vises hele titlen med første ords style.
                tipsTitleRef.current.innerHTML = `<span class="${styles.firstWord}">${tipsWords.join(' ')}</span>`;
            }
        }
    }, [news, tips]); // Dependency array, som sikrer at effekten kører, når news eller tips ændres.

    useEffect(() => {
        // useEffect hook til at hente artikler fra Supabase ved komponentens første render.
        const getData = async () => {
            // Asynkron funktion der fetcher data fra Supabase.
            const { data: articles, error } = await supabase
                .from('articles') // Henter data fra articles-tabellen.
                .select('*'); // Henter alle kolonner.

            if (error) {
                console.error('Error fetching articles:', error); // Logger fejl, hvis der opstår en.
            } else {
                // Filtrerer artiklerne for at finde nyheder, og sorterer dem tilfældigt.
                //filter er en metode, der bruges til at skabe en ny array, som kun indeholder de elementer, der opfylder en given betingelse.
                //I dette tilfælde filtrerer vi articles arrayet for kun at inkludere artikler, hvor article.is_news er true.
                //article => article.is_news er en callback funktion, der returnerer true eller false. Hvis article.is_news er true, inkluderes artiklen i det resulterende array. Hvis det er false, udelades artiklen.
                //0.5 - Math.random() sikrer at arrayet blandes helt tilfældigt
                //slice(0, 2) tager de første to elementer fra den tilfældigt sorterede array.
                setNews(articles.filter(article => article.is_news).sort(() => 0.5 - Math.random()).slice(0, 2));
                // Sætter en specifik artikel med id 2.
                setArticle(articles.find(article => article.id === 2));
                // Sætter en artikel med tips og tricks med id 4.
                setTips(articles.find(article => article.id === 4));
            }
        };
        getData(); // Kald funktionen for at hente data ved første render.
    }, []); // Tomt dependency array betyder, at effekten kun kører én gang, når komponenten mountes.

    return (
        <div className={styles.home}>
            <div className={styles.hero}>
                <img src={malerspandeImg} alt="Hero" />
            </div>
            
            {/* Nyhedssektion */}
            <section className={styles.newsSection}>
                {/* Itererer over news array og render hver artikel. */}
                {news.map((item, index) => (
                    <div key={item.id} className={styles.newsBox}>
                        {/* Ref sættes til hvert h3-element i titlesRef arrayet for senere DOM-manipulation. */}
                        <h3 ref={(el) => titlesRef.current[index] = el}>
                            {item.title}
                        </h3>
                        <p>{item.teaser}</p>
                        <a href={`/articles/${item.id}`} className={styles.readMore}>
                            <img src={iconPilHojre} alt="Læs mere" /> {/* Læs mere-knap */}
                        </a>
                    </div>
                ))}
            </section>
            
            {/* Artikelsektion */}
            <section className={styles.articleSection}>
                {article && ( //Betinget rendering med operatoren &&. Viser kun sektionen, hvis article-tilstanden ikke er null. Forhindrer blanke pladser i UI
                    <div className={styles.articleBox}>
                        <div className={styles.articleText}>
                            <h2>
                                <span className={styles.deepGreen}>Hvad sker der med</span>
                                <span className={styles.forestGreen}>dit sorterede affald</span>
                            </h2>
                            <p>{article.title}{article.teaser}</p> {/* Viser titel og teaser */}
                            <a href={`/articles/${article.id}`} className={styles.readMoreArticle}>
                                <img src={iconPilHojre} alt="Læs mere" /> {/* Læs mere-knap */}
                            </a>
                        </div>
                        <div className={styles.articleImage}>
                            <img src={affaldSkovImg} alt="Affald Skov" /> {/* Artikelbillede */}
                        </div>
                    </div>
                )}
            </section>

            {/* Tips og tricks-sektion */}
            <section className={styles.tipsSection}>
                {tips && ( //Betinget rendering med operatoren &&. Viser kun sektionen, hvis article-tilstanden ikke er null. Forhindrer blanke pladser i UI
                    <div className={styles.tipsBox}>
                        <div className={styles.tipsOgTricksImg}>
                            <img src={tipsOgTricksImg} alt="Tips og Tricks" /> {/* Tips-billede */}
                        </div>
                        <div className={styles.tips}>
                            <div>
                                <h1>Få gode idéer til, hvordan du gør det nemt at sortere affaldet hjemme hos dig.</h1>
                            </div>
                            <div>
                                {/* Ref til h2-titlen bruges til DOM-manipulation senere i useEffect. */}
                                <h2 ref={tipsTitleRef}>{tips.title}</h2>
                                <p>{tips.teaser}</p> {/* Viser teaser-tekst */}
                                <a href={`/articles/${tips.id}`} className={styles.readMore}>
                                    <img src={iconPilHojre} alt="Læs mere" /> {/* Læs mere-knap */}
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
