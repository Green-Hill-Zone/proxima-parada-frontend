import { usePageTitle, PAGE_TITLES } from "../../hooks";
import UserRegisterForm from "./components/UserRegisterForm";

function UserRegister() {
  // Define o título da página
  usePageTitle(PAGE_TITLES.REGISTER);
  
  return (
    <div style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      <UserRegisterForm />
    </div>
  );
}
export default UserRegister;