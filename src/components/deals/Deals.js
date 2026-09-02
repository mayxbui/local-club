import React, { useEffect, useState } from "react";
import DealsCard from "./DealsCard";
import DealsData from "./DealsData";
import Barcode from "react-barcode";
import { useUser } from "../contexts/UserContext";
import { db } from "../Firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

import mystery from "../../assets/mystery.png";
import present from "../../assets/present.png";
import task from "../../assets/task.png";

import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaFire,
  FaSearch,
  FaStar,
  FaTag,
  FaMapMarkerAlt,
  FaTrophy,
  FaRegCopy,
  FaCheckCircle,
} from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

import "./Deals.css";

const POINTS_GOAL = 300;

const Deals = () => {
  const { userDetails } = useUser();
  const [deals, setDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("hot");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [myDeals, setMyDeals] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    setDeals(DealsData);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userDetails?.uid) return;

      const userRef = doc(db, "Users", userDetails.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserPoints(data.points || 0);
        setMyDeals(data.myDeals || []);
      }
    };

    fetchUserData();
  }, [userDetails]);

  const handleRedeem = async () => {
    if (!userDetails || !selectedDeal) return;

    if (myDeals.includes(selectedDeal.title)) {
      toast.warning("You have already claimed this deal!");
      return;
    }
    if (userPoints < selectedDeal.points) {
      toast.error("Not enough points!");
      return;
    }

    const userRef = doc(db, "Users", userDetails.uid);
    const updatedPoints = userPoints - selectedDeal.points;
    const updatedMyDeals = [...myDeals, selectedDeal.title];

    await updateDoc(userRef, {
      points: updatedPoints,
      myDeals: updatedMyDeals,
    });

    setUserPoints(updatedPoints);
    setMyDeals(updatedMyDeals);
    toast.success("Deal redeemed successfully!");
  };

  const copyReferral = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("CHECKIN10");
      toast.success("Referral code copied!");
    }
  };

  const filteredDeals = deals.filter((deal) =>
    deal.locations.some((loc) =>
      loc.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const displayDeals =
    tab === "hot"
      ? filteredDeals
      : deals.filter((deal) => myDeals.includes(deal.title));

  const isMyDeal = selectedDeal && myDeals.includes(selectedDeal.title);
  const pointsLeft = Math.max(POINTS_GOAL - userPoints, 0);
  const progress = Math.min((userPoints / POINTS_GOAL) * 100, 100);

  return (
    <div className="dl-page">
      <div className="dl-main">
        {!selectedDeal ? (
          <>
            <header className="dl-hero">
              <div className="dl-hero__text">
                <span className="dl-hero__eyebrow">
                  <FaFire /> Local Club Deals
                </span>
                <h1>
                  Two spots, one deal, <span>double the fun</span>
                </h1>
                <p>
                  Spend your points on hand-picked pairs of local favorites —
                  a bite here, a treat there.
                </p>
              </div>

              <div className="dl-points-card">
                <div className="dl-points-card__top">
                  <span>Your points</span>
                  <FaStar />
                </div>
                <div className="dl-points-card__value">{userPoints}</div>
                <div className="dl-points-bar">
                  <div
                    className="dl-points-bar__fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="dl-points-card__hint">
                  {pointsLeft > 0
                    ? `${pointsLeft} pts to your next big reward`
                    : "You've unlocked a reward — go treat yourself!"}
                </div>
              </div>
            </header>

            <div className="dl-controls">
              <div className="dl-tabs">
                <button
                  className={tab === "hot" ? "is-active" : ""}
                  onClick={() => setTab("hot")}
                >
                  <FaFire /> Hot Deals
                </button>
                <button
                  className={tab === "my" ? "is-active" : ""}
                  onClick={() => setTab("my")}
                >
                  <FaCheckCircle /> My Deals
                </button>
              </div>

              <div className="dl-search">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search by location…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {displayDeals.length > 0 ? (
              <div className="dl-grid">
                {displayDeals.map((deal, index) => (
                  <DealsCard
                    key={index}
                    deal={deal}
                    onInfoClick={() => setSelectedDeal(deal)}
                    tab={tab}
                  />
                ))}
              </div>
            ) : (
              <div className="dl-empty">
                <FaTag />
                <p>
                  {tab === "my"
                    ? "No claimed deals yet. Redeem your first pairing from Hot Deals!"
                    : "No deals match that location — try another spot."}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="dl-detail">
            <button
              type="button"
              className="dl-detail__close"
              onClick={() => setSelectedDeal(null)}
            >
              <IoIosCloseCircle />
            </button>

            <div className="dl-detail__media">
              <img src={selectedDeal.image} alt={selectedDeal.title} />
              <span className="dl-detail__pts">{selectedDeal.points} pts</span>
            </div>

            <div className="dl-detail__body">
              <h2>{selectedDeal.title}</h2>
              <p className="dl-detail__tagline">{selectedDeal.tagline}</p>
              <p className="dl-detail__desc">{selectedDeal.description}</p>

              <div className="dl-detail__cols">
                <div>
                  <h4>
                    <FaTag /> Discounts
                  </h4>
                  <ul>
                    {selectedDeal.discounts.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>
                    <FaMapMarkerAlt /> Locations
                  </h4>
                  <ul>
                    {selectedDeal.locations.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="dl-detail__action">
                {tab === "my" && isMyDeal ? (
                  <div className="dl-barcode">
                    <Barcode
                      value={selectedDeal.title}
                      height={60}
                      displayValue={false}
                    />
                    <span>Show this at checkout</span>
                  </div>
                ) : (
                  <button
                    onClick={handleRedeem}
                    className="dl-redeem"
                    disabled={isMyDeal}
                  >
                    {isMyDeal
                      ? "Already claimed"
                      : `Redeem for ${selectedDeal.points} pts`}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <aside className="dl-rewards">
        <h3 className="dl-rewards__title">Earn more points</h3>

        <div className="dl-reward-card dl-reward-card--accent">
          <img src={mystery} alt="Mystery Box" />
          <div className="dl-reward-card__body">
            <h4>Mystery Box</h4>
            <p>50 pts a pop — could be anything</p>
            <button className="dl-reward-card__btn">Open</button>
          </div>
        </div>

        <div className="dl-reward-card">
          <img src={task} alt="Weekly Challenges" />
          <div className="dl-reward-card__body">
            <h4>Weekly Challenges</h4>
            <ul className="dl-challenge-list">
              <li>
                <FaCheckCircle /> Share a photo <span>+5</span>
              </li>
              <li>
                <FaCheckCircle /> Leave a review <span>+10</span>
              </li>
            </ul>
            <button className="dl-reward-card__btn">Go</button>
          </div>
        </div>

        <div className="dl-reward-card dl-referral">
          <h4>Refer a friend, get 10 pts</h4>
          <div className="dl-referral__code">
            <span>CHECKIN10</span>
            <button type="button" onClick={copyReferral} aria-label="Copy code">
              <FaRegCopy />
            </button>
          </div>
          <input
            type="text"
            value="https://myapp.com/signup?ref=CHECKIN10"
            readOnly
          />
        </div>

        <div className="dl-leaderboard">
          <h4>
            <FaTrophy /> This month's winners
          </h4>
          <img src={present} alt="Rewards" />
          <p className="dl-leaderboard__highlight">Look what your friends got!</p>
          <ol>
            {["User 1", "User 2", "User 3", "User 4", "User 5"].map((name, i) => (
              <li key={i}>
                <span className="dl-leaderboard__rank">{i + 1}</span>
                <FaUserCircle className="dl-leaderboard__avatar" />
                <span className="dl-leaderboard__name">{name}</span>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
};

export default Deals;
