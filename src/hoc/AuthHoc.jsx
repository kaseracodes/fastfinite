import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthHoc = (Component) => {
  const ComponentWithAuth = (props) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.userReducer.user);
    useEffect(() => {
      if (!user) {
        navigate("/");
      }
    }, [user, navigate]);

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
