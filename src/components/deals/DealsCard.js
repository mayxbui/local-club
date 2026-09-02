import React from "react";
import { FaTag, FaArrowRight } from "react-icons/fa";
import "./DealsCard.css";

const DealsCard = ({ deal, onInfoClick, tab }) => {
  return (
    <button type="button" className="dl-card" onClick={onInfoClick}>
      <div className="dl-card__media">
        <img src={deal.image} alt={deal.title} />
        <span className="dl-card__scrim" />
        <span className="dl-card__pts">{deal.points} pts</span>
        <h3 className="dl-card__title">{deal.title}</h3>
      </div>

      <div className="dl-card__body">
        <p className="dl-card__tagline">{deal.tagline}</p>

        <div className="dl-card__pair">
          {deal.locations.map((loc, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="dl-card__plus">+</span>}
              <span className="dl-card__spot">{loc}</span>
            </React.Fragment>
          ))}
        </div>

        <div className="dl-card__chips">
          {deal.discounts.map((d, i) => (
            <span className="dl-card__chip" key={i}>
              <FaTag /> {d}
            </span>
          ))}
        </div>

        <span className="dl-card__cta">
          {tab === "my" ? "Use now" : "View deal"} <FaArrowRight />
        </span>
      </div>
    </button>
  );
};

export default DealsCard;
