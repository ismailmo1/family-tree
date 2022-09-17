import { Container } from "@chakra-ui/react";
import { useAuth } from "../../hooks/use-auth";
import NavBar, { NavBarProps } from "../navigation/NavBar";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const mainLinks = user && [
    { text: "Find", link: "/find" },
    { text: "New", link: "/new" },
    { text: "Explore", link: `/family/${user?.id}?perspective=child` },
    { text: "Edit", link: "/edit" },
  ];

  return (
    <>
      <NavBar mainLinks={mainLinks} />
      <Container maxW={"80%"} centerContent>
        {children}
      </Container>
    </>
  );
};

export default Layout;
