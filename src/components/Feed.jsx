import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../Utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../Utils/constants";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Auto-fetch more users when feed is running low
  useEffect(() => {
    if (feed && feed.length <= 1) {
      getFeed();
    }
  }, [feed]);

  if (!feed)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (feed.length <= 0) {
    return <h1 className="flex justify-center my-10">No new users found!</h1>;
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
