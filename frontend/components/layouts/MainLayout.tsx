import { Container } from "@chakra-ui/react";
import NavBar, { NavItem } from "../navigation/NavBar";

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

  return (
    <>
      <NavBar mainLinks={mainLinks} />
      <Container maxW={1000} centerContent>
        {children}
      </Container>
    </>
  );
};

export default Layout;
