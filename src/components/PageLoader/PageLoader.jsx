import { MoonLoader } from "react-spinners";
import { COLORS } from "../../assets/constants";

const PageLoader = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MoonLoader color={COLORS.black} size={40} />
    </div>
  );
};

export default PageLoader;
