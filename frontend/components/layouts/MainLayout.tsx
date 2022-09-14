import { Container } from "@chakra-ui/react";
import { useAuth } from "../../hooks/use-auth";
import NavBar, { NavItem } from "../navigation/NavBar";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const mainLinks: NavItem[] = [
    { text: "Find", link: "/find" },
    { text: "New", link: "/new" },
    { text: "Explore", link: `/family/${user?.id}?perspective=child` },
    { text: "Edit", link: "/edit" },
  ];

  return (
    <>
      {user && <NavBar mainLinks={mainLinks} />}
      <Container maxW={1000} centerContent>
        {children}
      </Container>
    </>
  );
};

export default Layout;
