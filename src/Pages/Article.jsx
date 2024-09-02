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

            if (error) console.error('Error fetching article:', error);
            else setArticle(data);
        };

        fetchArticle();
    }, [id]);

    if (!article) return <p>Loading...</p>;

    return (
        <div className="article">
            <h1>{article.title}</h1>
            <p>{new Date(article.created_at).toLocaleDateString()}</p>
            <img src={article.image_url} alt={article.title} />
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
    );
};

export default Article;
