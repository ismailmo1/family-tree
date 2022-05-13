import { Container } from '@chakra-ui/react'
import Head from 'next/head'
import NavBar, { NavItem } from '../navigation/navbar'

interface LayoutProps {
    children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const mainLinks: NavItem[] = [{ text: 'Find', link: '/find' }, { text: 'Explore', link: '/explore' }, { text: 'Edit', link: '/edit' }]
    const avatarLinks: NavItem[] = [{ text: 'Sign Out', link: '/signout' }, { text: 'Account Settings', link: '/account-settings' }]

    return (
        <>
            <Head>
                <title>Family Tree</title>
                <link rel="icon" href="/tree.png"></link>
            </Head>
            <NavBar mainLinks={mainLinks} avatarLinks={avatarLinks} />
            <Container maxW={1000} >
                {children}
            </Container>
        </>
    )
}

export default Layout