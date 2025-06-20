import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import conf from "../../conf/conf";
import axios from "axios";
import { setUser } from "../../store/slices/userSlice" 

const AuthLayout = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authentication && !user) {
          const res = await axios.get(`${conf.VITE_BACKEND_URL}/current-user`, {
            withCredentials: true, 
          });

          if (res.data?.data) {
            dispatch(setUser(res.data.data));
          } else {
            navigate("/login");
          }
        } else if (!authentication && user) {
          navigate("/dashboard");
        }

        setLoader(false);
      } catch (error) {
        console.error("Auth check failed", error);
        navigate("/login");
        setLoader(false);
      }
    };

    checkAuth();
  }, [authentication, user, dispatch, navigate]);

  if (loader) {
    return <h1 className="text-center mt-10 text-xl">Loading...</h1>;
  }

  return <>{children}</>;
};

export default AuthLayout;
