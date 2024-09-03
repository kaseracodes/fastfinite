import { MoonLoader } from "react-spinners";
import { COLORS } from "../../assets/constants";

const PageLoader = () => {
  return (
    <div
      style={{
        width: "100%",
        // height: "60vh",
        height: "auto",
        minHeight: "200px",
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
