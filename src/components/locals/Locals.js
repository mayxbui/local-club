import React, { useState, useEffect } from "react";
import LocalsCard from "./LocalsCard";
import LocalsMap from "./LocalsMap";
import LocalsData from "./LocalsData";
import { useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

import { FaPhone } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { BsGlobe } from "react-icons/bs";
import { TiStarFullOutline } from "react-icons/ti";
import { IoIosCloseCircle } from "react-icons/io";

import "./Locals.css";

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

  // ✅ Filter locals
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
    <div className="locals-page">
      <div className="locals-list">
        {!infoLocal ? (
          <>
            <div className="filter-buttons">
              <button
                className={!filteredByLove ? "active" : ""}
                onClick={() => setFilteredByLove(false)}
              >
                OUR LOCALS
              </button>
              <button
                className={filteredByLove ? "active" : ""}
                onClick={() => setFilteredByLove(true)}
              >
                MY FAVORITES
              </button>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search locals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredLocals.map((local, index) => (
              <LocalsCard
                key={index}
                local={local}
                onClick={() => setSelectedLocal(local)}
                onInfoClick={() => {
                  setInfoLocal(local);
                }}
                selected={selectedLocal?.name === local.name}
                isLoved={favorites.includes(local.name)}
                onLoveToggle={() => toggleFavorite(local.name)}
              />
            ))}
          </>
        ) : (
          <div className="info-panel">
            <IoIosCloseCircle
              className="close-btn"
              onClick={() => setInfoLocal(null)}
            />

            <img
              src={infoLocal.image}
              alt={infoLocal.name}
              className="info-img"
            />

            <div className="info-description">
              <div className="info-header">
                <h2>{infoLocal.name}</h2>
                <h2 className="rating">
                  <TiStarFullOutline /> {infoLocal.rating}
                </h2>
              </div>

              <hr />

              <div className="info-line">
                <span>
                  <FaPhone />{" "}
                  <a href={`tel:${infoLocal.tel}`}>{infoLocal.tel}</a>
                </span>
              </div>

              <div className="info-line">
                <span>
                  <BsGlobe />{" "}
                  <a
                    href={infoLocal.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {infoLocal.name}
                  </a>
                </span>
              </div>

              <div className="info-line">
                <span>
                  <FaLocationDot />{" "}
                  <a
                    href={infoLocal.mapURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {infoLocal.address}
                  </a>
                </span>
              </div>

              <hr />

              <ul className="hours-list">
                {Object.entries(infoLocal.hours)
                  .sort(([dayA], [dayB]) => {
                    const order = [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ];
                    return order.indexOf(dayA) - order.indexOf(dayB);
                  })
                  .map(([day, time]) => (
                    <li key={day}>
                      <strong>{day}</strong> {time}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="locals-map-section">
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
