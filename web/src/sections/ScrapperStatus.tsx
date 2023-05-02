import { Box, Button, Card, Group, List, Text } from '@mantine/core';
import { IconHandStop } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { getStatsIntervalSec } from '../shared/constants/apiURLs';
import { ScrapperStats } from '../shared/interfaces/ScrapperStats';
import { getScrapperStats, stopScrapper } from '../shared/utils/api';

export default function ScrapperStatus() {
    const [stats, setStats] = useState<ScrapperStats>();

    useEffect(() => {
        // initial call
        (async () => {
            setStats(await getScrapperStats());
        })();

        // http polling for stats
        const interval = setInterval(async () => {
            setStats(await getScrapperStats());
        }, getStatsIntervalSec * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <Box>
            <Card shadow='xl' p='lg'>
                <Text weight={500} size='xl' mb='md'>
                    Scrapper Stats
                </Text>

                {stats ? (
                    <>
                        <List spacing='md' size='md' center>
                            <List.Item>
                                <Text fw={500} size='lg'>
                                    Status
                                </Text>
                                <Text size='md' color='dimmed'>
                                    {stats.status}
                                </Text>
                            </List.Item>
                            {stats.startTime ? (
                                <>
                                    <List.Item>
                                        <Text fw={500} size='lg'>
                                            Start Time:
                                        </Text>
                                        <Text size='md' color='dimmed'>
                                            {new Date(
                                                stats.startTime
                                            ).toISOString()}
                                        </Text>
                                    </List.Item>
                                    <List.Item>
                                        <Text fw={500} size='lg'>
                                            Keywords:
                                        </Text>
                                        <Text size='md' color='dimmed'>
                                            {stats.keywords}
                                        </Text>
                                    </List.Item>
                                    <List.Item>
                                        <Text fw={500} size='lg'>
                                            Target Price:
                                        </Text>
                                        <Text size='md' color='dimmed'>
                                            ${stats.targetPrice}
                                        </Text>
                                    </List.Item>
                                </>
                            ) : null}
                        </List>
                    </>
                ) : null}
            </Card>

            <Group position='apart' my='xl'>
                <Button
                    type='submit'
                    color='red'
                    leftIcon={<IconHandStop />}
                    disabled={
                        !(stats && stats.status === 'Scrapper is running.')
                    }
                    onClick={stopScrapper}
                >
                    Stop Scraper
                </Button>
            </Group>
        </Box>
    );
}
