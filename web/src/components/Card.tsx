import {
    Badge,
    Button,
    Flex,
    Group,
    Image,
    Card as MantineCard,
    Spoiler,
    Text,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';

export default function Card({
    title,
    condition,
    imageLink,
    price,
    link,
    shippingPrice,
}: {
    title: string;
    condition: string | null;
    imageLink: string;
    price: number;
    link: string;
    shippingPrice: number | null;
}) {
    return (
        <MantineCard shadow='sm' padding='lg' radius='md' withBorder h={'100%'}>
            <MantineCard.Section>
                <Image src={imageLink} height={250} alt={title} />
            </MantineCard.Section>

            <Flex mih={270} align='center'>
                <Flex direction='column'>
                    <Spoiler
                        maxHeight={50}
                        showLabel='Show more'
                        hideLabel='Hide'
                        mt='md'
                        mb='sm'
                    >
                        <Text fz='md' fw={700}>
                            {title}
                        </Text>
                    </Spoiler>

                    <Group position='apart' mb='xs' w={'100%'}>
                        <Text fz='xl' fw={700}>
                            {'$' + price}
                        </Text>
                        {condition ? (
                            <Badge color='pink' variant='light'>
                                {condition}
                            </Badge>
                        ) : null}
                    </Group>

                    <Group position='apart' mt='md' mb='xs'>
                        <Text fz='sm' color='dimmed'>
                            Shipping Price
                        </Text>
                        <Text fz='sm' fw={700} color='dimmed'>
                            {shippingPrice ? (
                                <>{'$' + shippingPrice}</>
                            ) : (
                                <>No data provided.</>
                            )}
                        </Text>
                    </Group>

                    <Button
                        variant='light'
                        color='blue'
                        fullWidth
                        mt='md'
                        radius='md'
                        component='a'
                        href={link}
                        target='_blank'
                    >
                        <Flex align='center' justify='space-between' gap='xs'>
                            <IconExternalLink size='1rem' />
                            <Text fw={700}>See Details Now</Text>
                        </Flex>
                    </Button>
                </Flex>
            </Flex>
        </MantineCard>
    );
}
