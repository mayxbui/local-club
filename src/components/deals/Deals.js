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
import { FaUserCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

import "./Deals.css";

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

  return (
    <div className="deals-page">
      <div className="deals-list">
        {!selectedDeal ? (
          <>
            <div className="tab-buttons">
              <button
                className={tab === "hot" ? "active" : ""}
                onClick={() => setTab("hot")}
              >
                HOT DEALS
              </button>
              <button
                className={tab === "my" ? "active" : ""}
                onClick={() => setTab("my")}
              >
                MY DEALS
              </button>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {displayDeals.map((deal, index) => (
              <DealsCard
                key={index}
                deal={deal}
                onInfoClick={() => setSelectedDeal(deal)}
                tab={tab}
              />
            ))}
          </>
        ) : (
          <div className="info-panel">
            <IoIosCloseCircle
              className="close-btn"
              onClick={() => setSelectedDeal(null)}
            />

            <img
              src={selectedDeal.image}
              alt={selectedDeal.title}
              className="info-img"
            />

            <div className="info-description">
              <div className="info-header">
                <h2>{selectedDeal.title}</h2>
                <h2 className="rating">{selectedDeal.points} pts</h2>
              </div>

              <hr />

              <p>{selectedDeal.description}</p>

              <hr />

              <div className="info-columns">
                <div>
                  <h4>Discounts:</h4>
                  <ul>
                    {selectedDeal.discounts.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Locations:</h4>
                  <ul>
                    {selectedDeal.locations.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="deal-action">
                {tab === "my" && isMyDeal ? (
                  <Barcode
                    value={selectedDeal.title}
                    height={60}
                    displayValue={false}
                  />
                ) : (
                  <button onClick={handleRedeem} className="redeem-btn">
                    Redeem for {selectedDeal.points} pts
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rewards">
        <div className="points-progress-container">
          <div className="points-header">
            <span>YOUR POINTS: {userPoints}</span>
            <span>300</span>
          </div>
          <div className="points-bar">
            <div
              className="points-fill"
              style={{ width: `${Math.min((userPoints / 300) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="rewards-content">
          <div className="rewards-list">
            <div className="mystery-box-card">
              <div className="box-left">
                <img src={mystery} alt="Mystery Box" className="mystery-img" />
              </div>
              <div className="box-right">
                <h3 className="box-title">Mystery Box</h3>
                <p className="box-desc">50 pts/each</p>
                <hr className="box-desc" />
                <button className="buy-btn">OPEN</button>
              </div>
            </div>

            <div className="bonus-tasks">
              <div className="box-left">
                <h4 className="box-title">Weekly Challenges</h4>
                <p className="box-desc">Share a photo for 5 pts</p>
                <p className="box-desc">Leave a review for 10 pts</p>
                <button className="buy-btn">GO</button>
              </div>
              <div className="box-right">
                <img src={task} alt="Bonus Task" className="bonus-img" />
              </div>
            </div>

            <div className="referral-section">
              <h4 className="box-title">Referral Bonus</h4>
              <p className="box-desc">Invite your friends and earn 10 points</p>

              <div className="box-desc referral-box">
                <div className="referral-code">
                  <label>Your Code</label>
                  <div className="code">CHECKIN10</div>
                </div>
                <div className="referral-link">
                  <label>Share Link</label>
                  <input
                    type="text"
                    value="https://myapp.com/signup?ref=CHECKIN10"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="monthly-board">
            <h3 className="box-title">April's Wrap</h3>
            <img src={present} alt="Rewards" className="rewards-img" />
            <p className="board-highlight">Look what your friends got!</p>

            <ol className="rank-list">
              <li>
                <span className="rank-num">1</span>
                <FaUserCircle className="avatar" />
                <span className="name">User 1</span>
              </li>
              <li>
                <span className="rank-num">2</span>
                <FaUserCircle className="avatar" />
                <span className="name">User 2</span>
              </li>
              <li>
                <span className="rank-num">3</span>
                <FaUserCircle className="avatar" />
                <span className="name">User 3</span>
              </li>
              <li>
                <span className="rank-num">4</span>
                <FaUserCircle className="avatar" />
                <span className="name">User 4</span>
              </li>
              <li>
                <span className="rank-num">5</span>
                <FaUserCircle className="avatar" />
                <span className="name">User 5</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deals;
