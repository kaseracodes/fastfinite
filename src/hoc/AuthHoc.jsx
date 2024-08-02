import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { logoutUser } from "../store/userSlice";

const AuthHoc = (Component) => {
  const ComponentWithAuth = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userReducer.user);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
        if (!authUser) {
          dispatch(logoutUser());
          navigate("/");
        }
      });

      if (!user) {
        navigate("/");
      }

      return () => {
        unsubscribe();
      };
    }, [user, navigate, dispatch]);

    if (!user) return null;

    return <Component {...props} />;
  };

  ComponentWithAuth.displayName = `AuthHoc(${getDisplayName(Component)})`;

  return ComponentWithAuth;
};

const getDisplayName = (Component) => {
  return Component.displayName || Component.name || "Component";
};

export default AuthHoc;
