import React from 'react';
import './HomePageCard.css';
import { useNavigate } from 'react-router-dom';

const DealsCardSlider = ({ id, image, title, tagline, points }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/deals', { state: { dealId: id } });
  };

  return (
    <div className="home-card" onClick={handleClick}>
      <img src={image} alt={title} className="home-card-image" />
      <div className="home-card-info">
        <h4 className="home-card-name">{title}</h4>
        <p className="home-card-desc">{tagline}</p>
        <div className="home-card-points">{points} pts</div>
      </div>
    </div>
  );
};

export default DealsCardSlider;
