import React, { useState, useEffect } from "react";
import LocalsCard from "./LocalsCard";
import LocalsMap from "./LocalsMap";
import LocalsData from "./LocalsData";
import { useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

import { FaPhone, FaLocationDot, FaMagnifyingGlass } from "react-icons/fa6";
import { BsGlobe } from "react-icons/bs";
import { TiStarFullOutline } from "react-icons/ti";
import { AiFillHeart } from "react-icons/ai";
import { IoIosCloseCircle } from "react-icons/io";

import "./Locals.css";

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Locals = () => {
  const { favorites, toggleFavorite } = useUser();
  const { state } = useLocation();
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [infoLocal, setInfoLocal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locals, setLocals] = useState([]);
  const [filteredByLove, setFilteredByLove] = useState(false);

  useEffect(() => {
    setLocals(LocalsData);
  }, []);

  useEffect(() => {
    if (state?.localName && locals.length > 0) {
      const matched = locals.find((l) => l.name === state.localName);
      if (matched) {
        setInfoLocal(matched);
        setSelectedLocal(matched);
      }
    }
  }, [state, locals]);

  const filteredLocals = locals.filter((local) => {
    const matchesSearch = local.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (filteredByLove) {
      return matchesSearch && favorites.includes(local.name);
    }
    return matchesSearch;
  });

  return (
    <div className="lc-page">
      <div className="lc-main">
        {!infoLocal ? (
          <>
            <header className="lc-hero">
              <div className="lc-hero__text">
                <span className="lc-hero__eyebrow">
                  <FaLocationDot /> Local Club
                </span>
                <h1>
                  Meet the <span>neighborhood</span>
                </h1>
                <p>
                  The independent shops, kitchens and makers that make this
                  town ours.
                </p>
              </div>

              <div className="lc-hero__stat">
                <div className="lc-hero__stat-num">{locals.length}</div>
                <div className="lc-hero__stat-label">local spots</div>
              </div>
            </header>

            <div className="lc-controls">
              <div className="lc-tabs">
                <button
                  className={!filteredByLove ? "is-active" : ""}
                  onClick={() => setFilteredByLove(false)}
                >
                  <FaLocationDot /> Our Locals
                </button>
                <button
                  className={filteredByLove ? "is-active" : ""}
                  onClick={() => setFilteredByLove(true)}
                >
                  <AiFillHeart /> My Favorites
                </button>
              </div>

              <div className="lc-search">
                <FaMagnifyingGlass />
                <input
                  type="text"
                  placeholder="Search locals…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredLocals.length > 0 ? (
              <div className="lc-grid">
                {filteredLocals.map((local, index) => (
                  <LocalsCard
                    key={index}
                    local={local}
                    onClick={() => setSelectedLocal(local)}
                    onInfoClick={() => setInfoLocal(local)}
                    selected={selectedLocal?.name === local.name}
                    isLoved={favorites.includes(local.name)}
                    onLoveToggle={() => toggleFavorite(local.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="lc-empty">
                <FaLocationDot />
                <p>
                  {filteredByLove
                    ? "No favorites yet — tap the heart on a spot you love."
                    : "No locals match that search."}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="lc-detail">
            <button
              type="button"
              className="lc-detail__close"
              onClick={() => setInfoLocal(null)}
            >
              <IoIosCloseCircle />
            </button>

            <div className="lc-detail__media">
              <img src={infoLocal.image} alt={infoLocal.name} />
              <span className="lc-detail__rating">
                <TiStarFullOutline /> {infoLocal.rating}
              </span>
            </div>

            <div className="lc-detail__body">
              <h2>{infoLocal.name}</h2>

              <div className="lc-detail__lines">
                <a className="lc-detail__line" href={`tel:${infoLocal.tel}`}>
                  <FaPhone /> {infoLocal.tel}
                </a>
                <a
                  className="lc-detail__line"
                  href={infoLocal.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsGlobe /> Visit website
                </a>
                <a
                  className="lc-detail__line"
                  href={infoLocal.mapURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLocationDot /> {infoLocal.address}
                </a>
              </div>

              <h4 className="lc-detail__hours-title">Opening hours</h4>
              <ul className="lc-hours">
                {Object.entries(infoLocal.hours)
                  .sort(
                    ([dayA], [dayB]) =>
                      DAY_ORDER.indexOf(dayA) - DAY_ORDER.indexOf(dayB),
                  )
                  .map(([day, time]) => (
                    <li key={day}>
                      <span className="lc-hours__day">{day}</span>
                      <span className="lc-hours__time">{time}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="lc-map">
        <LocalsMap
          locals={filteredLocals}
          selectedLocal={selectedLocal}
          setSelectedLocal={setSelectedLocal}
        />
      </div>
    </div>
  );
};

export default Locals;
