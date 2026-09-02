import React from 'react';
import './DealsCard.css';

const DealsCard = ({ deal, onInfoClick, tab }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (tab === 'my') {
      onInfoClick();
    }
  };

  const handleRedeemClick = (e) => {
    e.stopPropagation();
      onInfoClick();
  };

  return (
    <div className="card-horizontal">
      <div className="card-image">
        <img src={deal.image} alt={deal.title} />
      </div>
      <div className="card-info-wrapper">
        <div className="card-info">
          <h3>{deal.title}</h3>
          <p className="tagline">{deal.tagline}</p> 
          <div className="discounts">
            {deal.discounts.map((discount, index) => (
              <p key={index}>{discount}</p>
            ))}
          </div>
          <div className="meta">
            {tab === 'my' ? (
              <button className="use-now-btn" onClick={handleClick}>Use Now</button>
            ) : (
              <button 
                className="points-btn" 
                onClick={handleRedeemClick} 
              >
                {deal.points} pts
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsCard;