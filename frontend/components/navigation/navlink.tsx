import { Link, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { ReactNode } from 'react';

const NavLink: React.FC<{ children: ReactNode, link: string }> = ({ children, link }) => (
    <NextLink href={link} passHref>
        <Link
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
        >
            {children}
        </Link>
    </NextLink>
);

export default NavLink;