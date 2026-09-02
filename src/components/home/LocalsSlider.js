import React, { useEffect, useState } from 'react';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import LocalBusinessCard from './LocalsCard';
import './HomePageSlider.css';
import { FaArrowRight } from 'react-icons/fa';
  
const LocalBusinessSlider = () => {
  const [locals, setLocals] = useState([]);

  useEffect(() => {
    const fetchLocals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Locals'));
        const localsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLocals(localsList.slice(0, 10));
      } catch (error) {
        console.error('Error fetching locals:', error);
      }
    };
    fetchLocals();
  }, []);

  return (
    <div className="local-business-slider-section">
      <div className="slider-header">
        <h3>Local Business</h3>
        <a href="/locals" className="show-more">SHOW MORE <FaArrowRight /></a>
      </div>
      <div className="horizontal-scroll-container">
        {locals.map((local) => (
          <LocalBusinessCard
            key={local.id}
            id={local.id}
            name={local.name}
            image={local.image}
            shortDescription={local.shortDescription}
            rating={local.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default LocalBusinessSlider;
