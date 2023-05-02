import { AppShell, Container, Divider } from '@mantine/core';
import { NewItems, NewScrape, ScrapperStatus } from '.';
import { Header } from '../components';

export default function DefaultLayout() {
    return (
        <AppShell header={<Header />}>
            <Container py={0} px='xs'>
                <NewScrape />
                <Divider my='sm' />
                <ScrapperStatus />
                <Divider my='sm' />
                <NewItems />
            </Container>
        </AppShell>
    );
}
