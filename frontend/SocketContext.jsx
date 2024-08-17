import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";
import { backendUrl } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./shop/slices/userSlice";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setsocket] = useState(null);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  
  // const socket = useMemo(() => {
  // return io(
  //   backendUrl
  //{
  // transports: ["websocket"], // Force websocket transport to avoid using long-polling which may not be compatible
  //   }
  //   );
  // }, []);

  useEffect(() => {
    if (user && !socket) {
      const skt = io(backendUrl, {
        transports: ["websocket"], // Force websocket transport to avoid using long-polling
        reconnection: true, // Enable reconnection
        reconnectionAttempts: Infinity, // Retry indefinitely
        reconnectionDelay: 1000, // Initial delay before reconnection
        reconnectionDelayMax: 5000, // Maximum delay before reconnection
        timeout: 20000, // Connection timeout before failing
      });
      setsocket(skt);
    }
  }, [user?._id]);

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("addMe", {
        user,
      });
    }
  }, [socket, user?._id]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        dispatch(setUser(null));
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
