import AppRoutes from "./routes";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
const store = createStore({
  authName: "auth",
  authType: "localstorage",
});
function App() {
  return (
    <AuthProvider store={store}>
      <AppRoutes></AppRoutes>
    </AuthProvider>
  );
}

export default App;
