import { usePageTitle, PAGE_TITLES } from "../../hooks";
import UserRegisterForm from "./components/UserRegisterForm";

function UserRegister() {
  // Define o título da página
  usePageTitle(PAGE_TITLES.REGISTER);
  
  return (
    <>
      <UserRegisterForm />
    </>
  );
}
export default UserRegister;