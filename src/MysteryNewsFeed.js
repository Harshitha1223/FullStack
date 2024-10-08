import React, { useEffect, useState, useRef, useCallback } from 'react';
import MysteryCard from './components/MysteryCard';
import LoadingSpinner from './components/LoadingSpinner';
import './MysteryNewsFeed.css';

const MysteryNewsFeed = () => {
  const [mysteries, setMysteries] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const fetchMysteries = useCallback(async () => {
    if (loading) return; // Prevent multiple fetches
    setLoading(true);
    console.log(`Fetching mysteries on page ${page}...`);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setMysteries((prevMysteries) => [...prevMysteries, ...data]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching mysteries:', error);
      setLoading(false);
    }
  }, [page, loading]);

  useEffect(() => {
    if (hasMore) {
      fetchMysteries();
    }
  }, [fetchMysteries, hasMore]);

  const lastMysteryElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log('Last element in view, loading more mysteries...');
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="mystery-news-feed">
      <h1 className="feed-title">Interesting Mysteries Feed</h1>
      {mysteries.map((mystery, index) => {
        if (mysteries.length === index + 1) {
          return (
            <div ref={lastMysteryElementRef} key={mystery.id}>
              <MysteryCard
                title={mystery.title}
                description={mystery.body}
              />
            </div>
          );
        } else {
          return (
            <MysteryCard
              key={mystery.id}
              title={mystery.title}
              description={mystery.body}
            />
          );
        }
      })}
      {loading && <LoadingSpinner />}
      {!hasMore && <div className="end-message">No more mysteries to load.</div>}
    </div>
  );
};

export default MysteryNewsFeed;
