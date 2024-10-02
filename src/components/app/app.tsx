import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "../header/appHeader";
import { LoginPage } from "../../pages/login/login";
import { HomePage } from "../../pages/home/home";
import { Register } from "../../pages/register/register";
import { ForgotPassword } from "../../pages/forgotPassword/forgotPassword";
import { ResetPassword } from "../../pages/resetPassword/resetPassword";
import { Profile } from "../../pages/profile/profile";
import { ProfileOrders } from "../profileOrders/profileOrders";
import { FeedPage } from "../../pages/feed/feed";
import { ProfileOrderPage } from "../../pages/profileOrder/profileOrder";
import { IngredientPage } from "../../pages/ingredient/ingredient";
import { RouteGuard } from "../routes/protectedRouteElement";
import { FeedOrderPage } from "../../pages/feedOrder/feedOrder";
import { useAppDispatch, useAppSelector } from "../../services/store/hooks";
import { fetchIngredients } from "../../services/reducers/ingredientsSlice";

function App() {
  const location = useLocation();
  const background = location.state && location.state.modal;
  const { isAuthentficated } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Header isAuthentficated={isAuthentficated} />
      <Routes location={background || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<RouteGuard element={<LoginPage />} isProtected={false} />} />
        <Route path="/register" element={<RouteGuard element={<Register />} isProtected={false} />} />
        <Route path="/forgot-password" element={<RouteGuard element={<ForgotPassword />} isProtected={false} />} />
        <Route path="/reset-password" element={
          sessionStorage.getItem("forgotPasswordInitiated") === "true" 
            ? <RouteGuard element={<ResetPassword />} isProtected={false} />
            : <Navigate to="/forgot-password" replace />
        } />
        <Route path="/profile" element={<RouteGuard element={<Profile />} isProtected={true} />}>
          <Route path="orders" element={<RouteGuard element={<ProfileOrders />} isProtected={true} />} />
        </Route>
        <Route path="/profile/orders/:number" element={<RouteGuard element={<ProfileOrderPage  />} isProtected={true} />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:number" element={<FeedOrderPage />} />
      </Routes>
      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientPage />} />
          <Route path="/feed/:number" element={<FeedOrderPage />} />
          <Route path="orders/:number" element={<RouteGuard element={<ProfileOrderPage  />} isProtected={true} />} />
        </Routes>
      )}
    </DndProvider>
  );
}

export default App;
