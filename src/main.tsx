import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { MovieDetailsProvider } from './contexts/MovieDetailsContext'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProfilePage } from './pages/ProfilePage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { AllMoviesPage } from './pages/AllMoviesPage'
import { TermsConditionsPage } from './pages/TermsConditionsPage'
import { Navbar } from './components/Navbar'
import { SEOProvider } from './components/SEO'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SEOProvider>
      <BrowserRouter>
        <AuthProvider>
          <MovieDetailsProvider>
            <Navbar />
            <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/recomendaciones" element={<RecommendationsPage />} />
            <Route path="/peliculas" element={<AllMoviesPage />} />
            <Route path="/terminos-condiciones" element={<TermsConditionsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MovieDetailsProvider>
        </AuthProvider>
      </BrowserRouter>
    </SEOProvider>
  </StrictMode>,
)
