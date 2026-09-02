import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaMapMarkerAlt, FaQrcode, FaTags, FaStore } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TiStarFullOutline } from "react-icons/ti";

import { useUser } from "../contexts/UserContext";
import LocalsData from "../locals/LocalsData";
import LocalsMap from "../locals/LocalsMap";
import dealsData from "../deals/DealsData";
import LocalsSlider from "./LocalsSlider";
import DealsSlider from "./DealsSlider";
import "./Home.css";

const RESTAURANT_RE =
  /restaurant|burger|taco|pizza|\bpub\b|\bbar\b|bakery|caf[eé]|ice cream|beer|wine|bread|brunch|\bfood\b|espresso|pastr|margarita|dining|street food|comfort food/i;

function Home() {
  const { userDetails, loading, favorites, toggleFavorite } = useUser();
  const navigate = useNavigate();
  const [selectedLocal, setSelectedLocal] = useState(null);

  const mapLocals = useMemo(
    () => LocalsData.map((local, i) => ({ ...local, id: i })),
    []
  );

  const avgRating = useMemo(() => {
    if (!LocalsData.length) return "0.0";
    const total = LocalsData.reduce((sum, l) => sum + (l.rating || 0), 0);
    return (total / LocalsData.length).toFixed(1);
  }, []);

  const topRated = useMemo(
    () => [...mapLocals].sort((a, b) => b.rating - a.rating).slice(0, 6),
    [mapLocals]
  );

  const topRestaurants = useMemo(
    () =>
      mapLocals
        .filter((l) => RESTAURANT_RE.test(`${l.name} ${l.shortDescription}`))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5),
    [mapLocals]
  );

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (topRestaurants.length < 2) return undefined;
    const timer = setInterval(
      () => setHeroIndex((i) => (i + 1) % topRestaurants.length),
      4500
    );
    return () => clearInterval(timer);
  }, [topRestaurants.length]);

  const featured = topRestaurants[heroIndex];

  const openLocal = (name) => navigate("/locals", { state: { localName: name } });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="home-landing">
      {/* ---------- Hero ---------- */}
      <header className="home-hero">
        <div className="home-hero__slides">
          {topRestaurants.map((r, i) => (
            <img
              key={r.id}
              src={r.image}
              alt={r.name}
              className={`home-hero__slide ${i === heroIndex ? "is-active" : ""}`}
            />
          ))}
        </div>
        <div className="home-hero__scrim" />

        {featured && (
          <button
            type="button"
            className="home-hero__feature"
            onClick={() => openLocal(featured.name)}
          >
            <span className="home-hero__feature-label">Now featuring</span>
            <span className="home-hero__feature-name">{featured.name}</span>
            <span className="home-hero__feature-rating">
              <TiStarFullOutline /> {featured.rating} &middot; top-rated eats
            </span>
          </button>
        )}

        {topRestaurants.length > 1 && (
          <div className="home-hero__dots">
            {topRestaurants.map((r, i) => (
              <button
                key={r.id}
                type="button"
                aria-label={`Show ${r.name}`}
                className={i === heroIndex ? "is-active" : ""}
                onClick={() => setHeroIndex(i)}
              />
            ))}
          </div>
        )}

        <div className="home-hero__content">
          <span className="home-hero__badge">
            <FaMapMarkerAlt /> Greencastle, Indiana &middot; 46135
          </span>
          <h1>
            Your guide to <span>downtown Greencastle</span>
          </h1>
          <p className="home-hero__sub">
            One walkable square mile of family-owned shops, kitchens and
            craft makers. Find the local favorites, unlock member-only deals,
            and earn points every time you shop small.
          </p>
          <div className="home-hero__cta">
            <button
              className="home-btn home-btn--primary"
              onClick={() => navigate("/locals")}
            >
              Explore the locals <FaArrowRight />
            </button>
            <button
              className="home-btn home-btn--ghost"
              onClick={() => navigate("/deals")}
            >
              See this week's deals
            </button>
          </div>
          {userDetails && (
            <p className="home-hero__greeting">
              Welcome back, <strong>{userDetails.name}</strong>
              {typeof userDetails.points === "number" && (
                <span className="home-hero__points">
                  {userDetails.points} pts
                </span>
              )}
            </p>
          )}
        </div>
      </header>

      {/* ---------- Stats band ---------- */}
      <section className="home-stats">
        <div className="home-stat">
          <div className="home-stat__num">{LocalsData.length}</div>
          <div className="home-stat__label">LOCAL BUSINESSES</div>
        </div>
        <div className="home-stat">
          <div className="home-stat__num">{avgRating}&#9733;</div>
          <div className="home-stat__label">AVERAGE RATING</div>
        </div>
        <div className="home-stat">
          <div className="home-stat__num">{dealsData.length}</div>
          <div className="home-stat__label">CURATED DEALS</div>
        </div>
        <div className="home-stat">
          <div className="home-stat__num">100%</div>
          <div className="home-stat__label">LOCALLY OWNED</div>
        </div>
      </section>

      {/* ---------- Popular businesses ---------- */}
      <section className="home-section">
        <div className="home-section__head">
          <div>
            <h2>Popular downtown</h2>
            <p>The highest-rated spots on the square right now.</p>
          </div>
          <a href="/locals" className="home-section__link">
            View all <FaArrowRight />
          </a>
        </div>
        <div className="home-popular">
          {topRated.map((local) => {
            const loved = favorites.includes(local.name);
            return (
              <article
                key={local.id}
                className="pop-card"
                onClick={() => openLocal(local.name)}
              >
                <div className="pop-card__media">
                  <img src={local.image} alt={local.name} />
                  <span className="pop-card__rating">
                    <TiStarFullOutline /> {local.rating}
                  </span>
                  <button
                    className={`pop-card__fav ${loved ? "is-loved" : ""}`}
                    title={loved ? "Remove from favorites" : "Add to favorites"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(local.name);
                    }}
                  >
                    {loved ? <AiFillHeart /> : <AiOutlineHeart />}
                  </button>
                </div>
                <div className="pop-card__body">
                  <h3>{local.name}</h3>
                  <p>{local.shortDescription}</p>
                  <span className="pop-card__addr">
                    <FaMapMarkerAlt /> {local.address}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ---------- Map: show off the location ---------- */}
      <section className="home-section home-map">
        <div className="home-map__layout">
          <div className="home-map__aside">
            <h2>All on one square</h2>
            <p>
              Every spot on Local Club sits within a few blocks of the Putnam
              County courthouse. Tap a name to find it on the map.
            </p>
            <ul className="home-map__list">
              {topRated.map((local) => (
                <li
                  key={local.id}
                  className={selectedLocal?.id === local.id ? "is-active" : ""}
                  onClick={() => setSelectedLocal(local)}
                >
                  <span>{local.name}</span>
                  <span>
                    {local.rating}
                    <TiStarFullOutline style={{ verticalAlign: "-2px" }} />
                  </span>
                </li>
              ))}
            </ul>
            <a href="/locals" className="home-section__link">
              Open the full map <FaArrowRight />
            </a>
          </div>
          <div className="home-map__frame">
            <LocalsMap
              locals={mapLocals}
              selectedLocal={selectedLocal}
              setSelectedLocal={setSelectedLocal}
            />
          </div>
        </div>
      </section>

      {/* ---------- Deals ---------- */}
      <DealsSlider />

      {/* ---------- Locals ---------- */}
      <LocalsSlider />

      {/* ---------- How it works ---------- */}
      <section className="home-section">
        <div className="home-section__head">
          <div>
            <h2>How Local Club works</h2>
            <p>Shop local, stack points, redeem deals.</p>
          </div>
        </div>
        <div className="home-steps">
          <div className="home-step">
            <div className="home-step__icon">
              <FaStore />
            </div>
            <h3>Discover</h3>
            <p>
              Browse {LocalsData.length} downtown businesses with hours,
              ratings and directions in one place.
            </p>
          </div>
          <div className="home-step">
            <div className="home-step__icon">
              <FaQrcode />
            </div>
            <h3>Scan</h3>
            <p>
              Scan the Local Club code at checkout to log your visit and collect
              points automatically.
            </p>
          </div>
          <div className="home-step">
            <div className="home-step__icon">
              <FaTags />
            </div>
            <h3>Redeem</h3>
            <p>
              Trade points for {dealsData.length} rotating deals that pair up
              your favorite local spots.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="home-closing">
        <h2>Ready to explore the square?</h2>
        <p>Start with the highest-rated spots downtown.</p>
        <button
          className="home-btn home-btn--primary"
          onClick={() => navigate("/locals")}
        >
          Browse local businesses <FaArrowRight />
        </button>
      </section>
    </div>
  );
}

export default Home;
