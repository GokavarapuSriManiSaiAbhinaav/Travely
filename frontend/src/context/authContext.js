import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

// ✅ SAFELY parse user from localStorage
let user = null;
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser && storedUser !== "undefined") {
    user = JSON.parse(storedUser);
  }
} catch (err) {
  console.error("Failed to parse user from localStorage", err);
}

// ✅ Create initial state with parsed user
const INITIAL_STATE = {
  user: user,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  const logout = () => {
    localStorage.removeItem("user");
    axios.get("/api/logout").then(() => {
      dispatch({ type: "LOGOUT" });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
