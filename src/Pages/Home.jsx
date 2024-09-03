import React, { useState, useEffect, useRef } from 'react';
import supabase from '../../supabase';
import styles from './Home.module.scss';

// Importer billeder fra src/assets/img
import malerspandeImg from '../assets/img/malerspande.jpg';
import affaldSkovImg from '../assets/img/affald-skov-1.jpg';
import iconPilHojre from '../assets/img/Icon PilHojre.png';
import tipsOgTricksImg from '../assets/img/tips-og-tricks.jpg';

const Home = () => {
    const [news, setNews] = useState([]);
    const [article, setArticle] = useState(null);
    const [tips, setTips] = useState(null);
    const titlesRef = useRef([]);
    const tipsTitleRef = useRef(null); // Ref for h2 i tipsSection

    useEffect(() => {
        // Funktion for h3 titler i newsSection
        titlesRef.current.forEach((titleEl) => {
            if (titleEl) {
                const words = titleEl.innerText.split(' ');
                if (words.length > 1) {
                    titleEl.innerHTML = `<span class="${styles.firstWord}">${words[0]}</span> <span class="${styles.restOfTitle}">${words.slice(1).join(' ')}</span>`;
                }
            }
        });
// Funktion for h2 titel i tipsSection
if (tipsTitleRef.current) {
    const tipsWords = tipsTitleRef.current.innerText.split(' ');
    if (tipsWords.length >= 3) {
        const firstThreeWords = tipsWords.slice(0, 3).join(' ');
        const restOfTitle = tipsWords.slice(3).join(' ');
        tipsTitleRef.current.innerHTML = `<span class="${styles.firstWord}">${firstThreeWords}</span> <span class="${styles.restOfTitle}">${restOfTitle}</span>`;
    } else {
        // Hvis titlen har mindre end tre ord, vises hele titlen i firstWord
        tipsTitleRef.current.innerHTML = `<span class="${styles.firstWord}">${tipsWords.join(' ')}</span>`;
    }
}


    }, [news, tips]); // Tilføj tips som dependency

    useEffect(() => {
        const getData = async () => {
            const { data: articles, error } = await supabase
                .from('articles')
                .select('*');

            if (error) {
                console.error('Error fetching articles:', error);
            } else {
                setNews(articles.filter(article => article.is_news).sort(() => 0.5 - Math.random()).slice(0, 2));
                setArticle(articles.find(article => article.id === 2));
                setTips(articles.find(article => article.id === 4));
            }
        };
        getData();
    }, []);

    return (
        <div className={styles.home}>
            <div className={styles.hero}>
                <img src={malerspandeImg} alt="Hero" />
            </div>
            <section className={styles.newsSection}>
                {news.map((item, index) => (
                    <div key={item.id} className={styles.newsBox}>
                        <h3 ref={(el) => titlesRef.current[index] = el}>
                            {item.title}
                        </h3>
                        <p>{item.teaser}</p>
                        <a href={`/articles/${item.id}`} className={styles.readMore}>
                            <img src={iconPilHojre} alt="Læs mere" />
                        </a>
                    </div>
                ))}
            </section>
            <section className={styles.articleSection}>
                {article && (
                    <div className={styles.articleBox}>
                        <div className={styles.articleText}>
                            <h2>
                                <span className={styles.deepGreen}>Hvad sker der med</span>
                                <span className={styles.forestGreen}>dit sorterede affald</span>
                            </h2>
                            <p>{article.title}{article.teaser}</p>

                            <a href={`/articles/${article.id}`} className={styles.readMoreArticle}>
                                <img src={iconPilHojre} alt="Læs mere" />
                            </a>
                        </div>
                        <div className={styles.articleImage}>
                            <img src={affaldSkovImg} alt="Affald Skov" />
                        </div>
                    </div>
                )}
            </section>
            <section className={styles.tipsSection}>
                {tips && (
                    <div className={styles.tipsBox}>
                        <div className={styles.tipsOgTricksImg}>
                            <img src={tipsOgTricksImg} alt="Tips og Tricks" />
                        </div>
                        <div className={styles.tips}>
                            <div>
                                <h1>Få gode idéer til, hvordan du gør det nemt at sortere affaldet hjemme hos dig.</h1>
                            </div>
                            <div>
                                <h2 ref={tipsTitleRef}>{tips.title}</h2> {/* Brug ref her */}
                                <p>{tips.teaser}</p>
                                <a href={`/articles/${tips.id}`} className={styles.readMore}>
                                    <img src={iconPilHojre} alt="Læs mere" />
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
