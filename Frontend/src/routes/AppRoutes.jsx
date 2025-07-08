import { Routes, Route } from 'react-router-dom'
import LayoutWrapper from '../components/layout/LayoutWrapper'
import AdminLayout from '../components/layout/AdminLayout'

// Public Pages
import Home from '../pages/Home'
import Login from '../auth/Login'
import Register from '../auth/Register'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Profile from '../pages/Profile'
import Orders from '../pages/Orders'
import NotFound from '../pages/NotFound'

// Categories
import Men from '../pages/categories/Men'
import Women from '../pages/categories/Women'
import Kids from '../pages/categories/Kids'

// Admin
import Dashboard from '../admin/Dashboard'
import ManageProducts from '../admin/ManageProducts'
import ManageOrders from '../admin/ManageOrders'
import ManageUsers from '../admin/ManageUsers'
import AddNewProduct from '../admin/AddNewProduct'
import EditProduct from '../admin/EditProduct'

// Auth utils
import PrivateRoute from '../auth/privateRoute'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Layout for regular users */}
      <Route path="/" element={<LayoutWrapper />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="men" element={<Men />} />
        <Route path="women" element={<Women />} />
        <Route path="kids" element={<Kids />} />

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
      </Route>
    </Routes>
  )
}

export default AppRoutes
