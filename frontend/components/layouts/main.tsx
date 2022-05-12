import { Container } from '@chakra-ui/react'
import { FC } from 'react'

interface LayoutProps {
    children?: React.ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (<Container >
        {children}
    </Container>
    )
}

export default Layout