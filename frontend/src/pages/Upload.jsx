import React, { useContext, useEffect, useState } from "react";
import UploadContent from "../components/upload/UploadContent";
import { AppContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Upload = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (user) setIsLogin(true);
  }, []);

  return (
    <div>
      <UploadContent isLogin={isLogin} />
    </div>
  );
};

export default Upload;
