import { useContext } from "react";
import AppRoutes from "./routes/AppRoutes";
import { ThemeContext } from "./context/ThemeContextValue";

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme === "dark" ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-gray-50 text-slate-900"}>
      <AppRoutes />
    </div>
  );
}

export default App;