import { Container } from "@chakra-ui/react";
import { useAuth } from "../../hooks/use-auth";
import NavBar, { NavItem } from "../navigation/NavBar";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const auth = useAuth();

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

  if (auth.token) {
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
