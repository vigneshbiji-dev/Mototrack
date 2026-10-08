import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyGarage from './pages/MyGarage'
import BikeDetail from './pages/BikeDetail'
import AddBike from './pages/AddBike'
import FuelLogs from './pages/FuelLogs'
import AddFuel from './pages/AddFuel'
import ServiceLogs from './pages/ServiceLogs'
import AddService from './pages/AddService'
import ExpensesPage from './pages/Expenses'
import AddExpense from './pages/AddExpense'
import Analytics from './pages/Analytics'
import Reminders from './pages/Reminders'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-bg text-text antialiased">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/garage" element={<MyGarage />} />
              <Route path="/garage/add" element={<AddBike />} />
              <Route path="/garage/edit/:id" element={<AddBike />} />
              <Route path="/garage/:id" element={<BikeDetail />} />
              <Route path="/fuel" element={<FuelLogs />} />
              <Route path="/fuel/add" element={<AddFuel />} />
              <Route path="/fuel/edit/:id" element={<AddFuel />} />
              <Route path="/service" element={<ServiceLogs />} />
              <Route path="/service/add" element={<AddService />} />
              <Route path="/service/edit/:id" element={<AddService />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/expenses/add" element={<AddExpense />} />
              <Route path="/expenses/edit/:id" element={<AddExpense />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
