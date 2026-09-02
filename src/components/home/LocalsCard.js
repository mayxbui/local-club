import React from 'react';
import './HomePageCard.css';
import { useNavigate } from 'react-router-dom';
import { TiStarFullOutline } from "react-icons/ti";


const LocalBusinessCard = ({ name, image, shortDescription, rating }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/locals', { state: { localName: name } });
  };

  return (
    <div className="home-card" onClick={handleClick}>
      <img src={image} alt={name} className="home-card-image" />
      <div className="home-card-info">
        <h4 className="home-card-name">{name}</h4>
        <p className="home-card-desc">{shortDescription}</p>
        <span className="rating-container">
          <TiStarFullOutline className="icon" />
          <div className="rating">{rating}</div>
        </span>
      </div>
    </div>
  );
};

export default LocalBusinessCard;
