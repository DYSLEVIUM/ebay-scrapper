import { Box, Text } from '@mantine/core';
import { ScrapperForm } from '../components';

export default function Home() {
    return (
        <Box pb='md'>
            <Text fz={24} fw={700} mb='md'>
                Start a new Scrape
            </Text>
            <ScrapperForm />
        </Box>
    );
}
