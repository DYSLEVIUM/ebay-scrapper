import { Box, Text } from '@mantine/core';
import { CardsWrapper } from '../components';

export default function NewItems() {
    return (
        <Box py='lg'>
            <Text fz={24} fw={700} mb='md'>
                New Items
            </Text>
            <CardsWrapper />
        </Box>
    );
}
