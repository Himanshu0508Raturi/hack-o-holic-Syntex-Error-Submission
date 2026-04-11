// This file is kept for compatibility but the app now routes through App.tsx directly
import { Navigate } from "react-router-dom";
const Index = () => <Navigate to="/" replace />;
export default Index;
