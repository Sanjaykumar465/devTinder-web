import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
import appStore from "./Utils/appStore";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import ProtectedRoute from "./components/ProtectedRoute";
import Requests from "./components/Requests";
import SignUp from "./components/signUp";
import Chat from "./components/Chat";
import { SocketProvider } from "./contexts/SocketContext"; // Add this import

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <SocketProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Body />}>
                <Route index element={<Feed />} />
                <Route path="profile" element={<Profile />} />
                <Route path="connections" element={<Connections />} />
                <Route path="request" element={<Requests />} />
                <Route path="chat/:targetUserId" element={<Chat />} />
              </Route>
            </Route>
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;