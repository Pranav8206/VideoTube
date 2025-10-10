import React, { useContext, useEffect, useState } from "react";
import UploadContent from "../components/upload/UploadContent";
import { AppContext } from "../context/context";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Upload = () => {
  const [loading, setLoading] = useState(true);
  const { user, fetchCurrentUser } = useContext(AppContext);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        await fetchCurrentUser();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [fetchCurrentUser]);

  if (loading) {
    return (
      <div className="relative flex items-center justify-center h-[88vh] w-full">
        <Loader />
      </div>
    );
  }

  return <UploadContent isLogin={!!user?._id} />;
};

export default Upload;
