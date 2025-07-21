import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AdminLayout from '../components/layout/AdminLayout'

// Public Pages
import Home from '../pages/Home'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Profile from '../pages/Profile'
import Orders from '../pages/Orders'
import Chat from '../pages/Chat'
import NotFound from '../pages/NotFound'

// Categories
import Categories from '../pages/Categories'

// Footer Pages
import SaleItems from '../pages/SaleItems'
import NewArrivals from '../pages/NewArrivals'
import HelpCenter from '../pages/HelpCenter'
import SizeGuide from '../pages/SizeGuide'
import ShippingInfo from '../pages/ShippingInfo'
import ReturnsExchanges from '../pages/ReturnsExchanges'
import ContactSupport from '../pages/ContactSupport'
import AboutUs from '../pages/AboutUs'
import Careers from '../pages/Careers'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import TermsOfService from '../pages/TermsOfService'

// Admin
import Dashboard from '../admin/Dashboard'
import ManageProducts from '../admin/ManageProducts'
import ManageOrders from '../admin/ManageOrders'
import ManageUsers from '../admin/ManageUsers'
import ManageChats from '../admin/ManageChats'
import AddNewProduct from '../admin/AddNewProduct'
import EditProduct from '../admin/EditProduct'
import Analytics from '../admin/Analytics'
import SystemSettings from '../admin/SystemSettings'

// Auth utils
import PrivateRoute from '../auth/PrivateRoute'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Layout for regular users */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />

        <Route path="men" element={<Categories />} />
        <Route path="women" element={<Categories />} />
        <Route path="kids" element={<Categories />} />

        {/* Footer Pages */}
        <Route path="sale-items" element={<SaleItems />} />
        <Route path="new-arrivals" element={<NewArrivals />} />
        <Route path="help-center" element={<HelpCenter />} />
        <Route path="size-guide" element={<SizeGuide />} />
        <Route path="shipping-info" element={<ShippingInfo />} />
        <Route path="returns-exchanges" element={<ReturnsExchanges />} />
        <Route path="contact-support" element={<ContactSupport />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="careers" element={<Careers />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />

        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />

        {/* Protected Routes */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Layout for admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          path="dashboard"
          element={
            <PrivateRoute adminOnly={true}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="products"
          element={
            <PrivateRoute adminOnly={true}>
              <ManageProducts />
            </PrivateRoute>
          }
        />
        <Route
          path="add-product"
          element={
            <PrivateRoute adminOnly={true}>
              <AddNewProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="products/edit/:id"
          element={
            <PrivateRoute adminOnly={true}>
              <EditProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="orders"
          element={
            <PrivateRoute adminOnly={true}>
              <ManageOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="users"
          element={
            <PrivateRoute adminOnly={true}>
              <ManageUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="chats"
          element={
            <PrivateRoute adminOnly={true}>
              <ManageChats />
            </PrivateRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <PrivateRoute adminOnly={true}>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route
          path="settings"
          element={
            <PrivateRoute adminOnly={true}>
              <SystemSettings />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes
