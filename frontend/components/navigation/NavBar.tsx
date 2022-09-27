import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useAuth } from "../../hooks/use-auth";
import NavLink from "./NavLink";

export interface NavItem {
  text: string;
  link: string;
}

export interface NavBarProps {
  children?: ReactNode;
  mainLinks: NavItem[] | null;
}

const NavBar: React.FC<NavBarProps> = ({ mainLinks }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, signout } = useAuth();

  const accountNavLinks = user ? (
    <Menu>
      <MenuButton as={Button} rounded={"full"} cursor={"pointer"} minW={0}>
        {user.username}
      </MenuButton>

      <MenuList>
        <MenuItem key="/account-settings">
          <Link href="/account-settings">Account Settings</Link>
        </MenuItem>
        <MenuItem key="/logout">
          <Text onClick={() => signout()}>Logout</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <Link href="/login">Login</Link>
  );
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {mainLinks && (
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon border={"0px"} /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
          )}
          <HStack spacing={8} alignItems={"center"}>
            <Link href="/">
              <Box as="button">
                <Text fontSize={"2xl"}>🌳</Text>
              </Box>
            </Link>
            {mainLinks && (
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {mainLinks.map((link) => (
                  <NavLink key={link.text} link={link.link}>
                    {link.text}
                  </NavLink>
                ))}
              </HStack>
            )}
          </HStack>
          <Flex alignItems={"center"}>{accountNavLinks}</Flex>
        </Flex>

        {isOpen && mainLinks ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {mainLinks.map((link) => (
                <NavLink link={link.link} key={link.text}>
                  {link.text}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default NavBar;
