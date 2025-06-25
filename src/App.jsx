import { AuthProvider } from "./AuthProvider";
import Dashboard from "./Dashboard";
import { Login } from "./Login";
import EntryPage from "./EntryPage";
import { BrowserRouter as Router, Routes, Route , Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        {({ user, loading, signInWithGoogle }) => {
          if (loading) return <div className="text-center">Loading...</div>;
          return (
            <Routes>
              <Route
                path="/"
                element={user ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/entry/:date"
                element={user ? <EntryPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={
                  user ? (
                    <Navigate to="/" />
                  ) : (
                    <Login signIn={signInWithGoogle} />
                  )
                }
              />
              <Route
                path="*"
                element={<Navigate to={user ? "/" : "/login"} />}
              />
            </Routes>
          );
        }}
      </AuthProvider>
    </Router>
  );
}

export default App;
