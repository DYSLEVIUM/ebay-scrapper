import {
    ActionIcon,
    Container,
    Flex,
    Header as MantineHeader,
    Text,
    useMantineColorScheme,
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

export default function Header() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <MantineHeader height={80} p='md' display={'flex'}>
            <Container py={0} px='xs' w={'100%'}>
                <Flex align='center' h={'100%'} justify={'space-between'}>
                    <Text fz={32} fw={700} c={'blue'}>
                        Scraper
                    </Text>
                    <ActionIcon
                        variant='outline'
                        color={dark ? 'yellow' : 'blue'}
                        onClick={() => toggleColorScheme()}
                        title='Toggle color scheme'
                    >
                        {dark ? (
                            <IconSun size='1.1rem' />
                        ) : (
                            <IconMoonStars size='1.1rem' />
                        )}
                    </ActionIcon>
                </Flex>
            </Container>
        </MantineHeader>
    );
}
