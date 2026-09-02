import { useState } from 'react';
import '../logIn/LogIn.css';
import {auth, db} from "../Firebase";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {setDoc, doc} from "firebase/firestore";
import {toast} from "react-toastify";



const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if(user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          name: name,
          points: 100,
        });
      }
      console.log("User Registered Successfully");
      toast.success("User Registered Successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.success(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
      <h2 className="brand">Register</h2>
      <form onSubmit={handleRegister} className="login-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
       
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>

        <p className="terms">
          By creating an account, you agree to our <span className="termsofservice">Terms</span>.
        </p>


        <button type="submit" className="login-btn">
          REGISTER
        </button>
      </form>


      <div className="register-link">
        Already have an account? <a href="login">Log In</a>
      </div>
    </div>
    </div>
    
  );
};


export default Register;