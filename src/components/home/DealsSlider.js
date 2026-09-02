import React, { useEffect, useState } from 'react';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import './HomePageSlider.css';
import { FaArrowRight } from 'react-icons/fa';
import DealsCard from './DealsCard';

const DealsSlider = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Deals'));
        const dealsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDeals(dealsList.slice(0, 10));
      } catch (error) {
        console.error('Error fetching deals:', error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className="local-business-slider-section">
      <div className="slider-header">
        <h3>Hot Deals</h3>
        <a href="/deals" className="show-more">SHOW MORE <FaArrowRight /></a>
      </div>
      <div className="horizontal-scroll-container">
        {deals.map(deal => (
          <DealsCard
            key={deal.id}
            id={deal.id}
            title={deal.title}
            image={deal.image}
            tagline={deal.tagline}
            points={deal.points}
          />
        ))}
      </div>
    </div>
  );
};

export default DealsSlider;
