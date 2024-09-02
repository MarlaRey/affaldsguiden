import React, { useState, useEffect } from 'react';
import supabase from '../../supabase';
import styles from './Home.module.scss';

const Home = () => {
    const [news, setNews] = useState([]);
    const [article, setArticle] = useState(null);
    const [tips, setTips] = useState(null);

    useEffect(() => {
        const getData = async () => {
            // Foretag en forespørgsel til Supabase for at hente artiklerne
            const { data: articles, error } = await supabase
                .from('articles')
                .select('*');

            if (error) {
                console.error('Error fetching articles:', error);
            } else {
                setNews(articles.filter(article => article.is_news).slice(0, 2));
                setArticle(articles.find(article => article.id === 2));
                setTips(articles.find(article => article.id === 4));
            }
        };
        getData();
    }, []);

    return (
        <div className="home">
            <div className="hero"> {/* Hero section with a background image */}</div>
            <section className="news-section">
                {news.map((item) => (
                    <div key={item.id} className="news-box">
                        <h3>{item.title}</h3>
                        <p>{item.teaser}</p>
                    </div>
                ))}
            </section>
            <section className="article-section">
                {article && (
                    <div className="article-box">
                        <h2>{article.title}</h2>
                        <p>{article.teaser}</p>
                        <a href={`/articles/${article.id}`}>Læs mere</a>
                    </div>
                )}
                {tips && (
                    <div className="tips-box">
                        <h2>{tips.title}</h2>
                        <p>{tips.teaser}</p>
                        <a href={`/articles/${tips.id}`}>Læs mere</a>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
