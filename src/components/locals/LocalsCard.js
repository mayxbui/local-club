import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { TiStarFullOutline } from "react-icons/ti";
import { FaLocationDot, FaArrowRight } from "react-icons/fa6";
import "./LocalsCard.css";

const LocalsCard = ({
  local,
  onClick,
  onInfoClick,
  onLoveToggle,
  isLoved,
  selected,
}) => {
  return (
    <div
      className={`lc-card ${selected ? "is-selected" : ""}`}
      onClick={onClick}
    >
      <div className="lc-card__media">
        <img src={local.image} alt={local.name} />
        <span className="lc-card__scrim" />
        <span className="lc-card__rating">
          <TiStarFullOutline /> {local.rating}
        </span>
        <button
          type="button"
          className={`lc-card__love ${isLoved ? "is-loved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onLoveToggle();
          }}
          aria-label={isLoved ? "Remove from favorites" : "Add to favorites"}
        >
          {isLoved ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>
      </div>

      <div className="lc-card__body">
        <h3>{local.name}</h3>
        <p className="lc-card__desc">{local.shortDescription}</p>
        <p className="lc-card__addr">
          <FaLocationDot /> {local.address}
        </p>
        <button
          type="button"
          className="lc-card__cta"
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick();
          }}
        >
          View details <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default LocalsCard;
