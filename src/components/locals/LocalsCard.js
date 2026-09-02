import React from 'react';
import { AiOutlineInfoCircle, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { TiStarFullOutline } from "react-icons/ti";
import './LocalsCard.css';

const LocalsCard = ({ local, onClick, onInfoClick, onLoveToggle, isLoved, selected }) => {
  return (
    <div className="card-horizontal" onClick={onClick}>
      <div className="card-image">
        <img src={local.image} alt={local.name} />
      </div>
      <div className={`card-info-wrapper ${selected ? 'selected' : ''}`}>
        <div className="card-info">
          <h3>{local.name}</h3>
          <p className="description">{local.shortDescription}</p>
          <p className="address">{local.address}</p>
          <div className="meta">
            <span className="rating-container">
              <TiStarFullOutline className="icon" />
              <div className="rating">{local.rating}</div>
            </span>
            <span className="icons">
              <AiOutlineInfoCircle 
                className="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onInfoClick();
                }}
                title="More Info"
              />
              {isLoved ? (
                <AiFillHeart
                  className="icon loved"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoveToggle();
                  }}
                  title="Unfavorite"
                />
              ) : (
                <AiOutlineHeart
                  className="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoveToggle();
                  }}
                  title="Favorite"
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalsCard;
