import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Article.module.scss';
import supabase from '../../supabase';

const Article = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching article:', error);
            } else {
                setArticle(data);
            }
        };

        fetchArticle();
    }, [id]);

    if (!article) return <p>Loading...</p>;

    // Convert published_at to a proper date string
    const publishedDate = new Date(article.published_at).toLocaleDateString('da-DK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className={styles.article}>
            <h1 className={styles.title}>{article.title}</h1>
            <p className={styles.teaser}>{article.teaser}</p>
            <p className={styles.publishedAt}>
                {isNaN(new Date(article.published_at)) ? 'Invalid Date' : publishedDate}
            </p>
            {article.image_url && (
                <img
                    src={article.image_url}
                    alt={article.title}
                    className={styles.articleImage}
                />
            )}
            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: article.html_content || '' }}
            />
        </div>
    );
};

export default Article;
