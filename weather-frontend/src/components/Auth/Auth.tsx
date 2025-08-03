import React, { useState, useEffect } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";
import { jwtDecode, JwtPayload } from "jwt-decode"; // To decode the JWT token

const GOOGLE_CLIENT_ID =
  "51828961481-avak5lpo6fbti1et2dtvh00baft366g8.apps.googleusercontent.com";

interface UserProfile extends JwtPayload {
  name: string;
  email: string;
  picture: string;
}

export const Auth: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);

  // Load user profile from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Login Success:", credentialResponse);
    // Decode the JWT token to get user information
    const decoded: JwtPayload = jwtDecode(credentialResponse.credential as string);
    console.log("Decoded User Info:", decoded);

    // Save user profile to state and local storage
    setUserProfile(decoded as UserProfile);
    localStorage.setItem("userProfile", JSON.stringify(decoded));

    // You would typically send this 'credentialResponse.credential' (ID token) to your backend
    // for verification and further authentication/authorization.
    // Example: sendTokenToBackend(credentialResponse.credential);
  };

  const handleLoginError = () => {
    console.log("Login Failed");
    setUserProfile(undefined);
  };

  const handleLogout = () => {
    googleLogout(); // This clears the Google session
    setUserProfile(undefined);
    localStorage.removeItem("userProfile");
    console.log("Logged out");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Google Authentication with React</h1>

        {userProfile ? (
          <div>
            <h2>Welcome, {userProfile.name}!</h2>
            <img
              src={userProfile.picture}
              alt="Profile"
              style={{ borderRadius: "50%", width: "100px", height: "100px" }}
            />
            <p>Email: {userProfile.email}</p>
            <button
              onClick={handleLogout}
              style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <p>Please sign in with your Google account:</p>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              // You can customize the button appearance
              // theme="filled_blue"
              // size="large"
              // text="signin_with"
            />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};
