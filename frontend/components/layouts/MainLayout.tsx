import { Container } from "@chakra-ui/react";
import { useUser } from "../../hooks/useUser";
import NavBar, { NavItem } from "../navigation/NavBar";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoggedIn, token } = useUser();

  const mainLinks: NavItem[] = [
    { text: "Find", link: "/find" },
    { text: "New", link: "/new" },
    { text: "Explore", link: "/explore" },
    { text: "Edit", link: "/edit" },
  ];

  let avatarLinks: NavItem[] = [
    { text: "Login", link: "/login" },
    { text: "Account Settings", link: "/account-settings" },
  ];

  if (isLoggedIn) {
    avatarLinks = [
      { text: "Logout", link: "/logout" },
      { text: "Account Settings", link: "/account-settings" },
    ];
  }

  return (
    <>
      <NavBar mainLinks={mainLinks} avatarLinks={avatarLinks} />
      <Container maxW={1000} centerContent>
        {children}
      </Container>
    </>
  );
};

export default Layout;
