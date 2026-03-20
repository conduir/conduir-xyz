import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from './web3/providers/WagmiProvider';
import { TransactionQueue } from './components/web3/TransactionQueue';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Docs from './pages/Docs';
import Faucet from './pages/Faucet';
import Admin from './pages/Admin';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="app" element={<Dashboard />} />
          <Route path="docs" element={<Docs />} />
          <Route path="faucet" element={<Faucet />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <WagmiProvider>
      <TransactionQueue />
      <AppRoutes />
    </WagmiProvider>
  );
}
