import { Container } from "@chakra-ui/react";
import NavBar, { NavItem } from "../navigation/navbar";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const mainLinks: NavItem[] = [
    { text: "Find", link: "/find" },
    { text: "New", link: "/new" },
    { text: "Explore", link: "/explore" },
    { text: "Edit", link: "/edit" },
  ];
  const avatarLinks: NavItem[] = [
    { text: "Sign Out", link: "/signout" },
    { text: "Account Settings", link: "/account-settings" },
  ];

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
