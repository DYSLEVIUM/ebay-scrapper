import { Button, Grid, NumberInput, TextInput, Tooltip } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';

import {
    IconAlertCircle,
    IconCoin,
    IconPlayerPlayFilled,
} from '@tabler/icons-react';
import { startNewScrape } from '../shared/utils/api';

const rightSection = (label: string) => {
    return (
        <Tooltip label={label} position='top-end' withArrow>
            <div>
                <IconAlertCircle
                    size='1rem'
                    style={{
                        display: 'block',
                        opacity: 0.5,
                    }}
                />
            </div>
        </Tooltip>
    );
};

const submit = async ({
    keywords,
    targetPrice,
}: {
    keywords: string;
    targetPrice: number;
}) => {
    try {
        await startNewScrape(keywords, targetPrice);
    } catch (err) {
        console.error(err);
    }
};

export default function ScrapperForm() {
    const form = useForm({
        initialValues: {
            keywords: '',
            targetPrice: 0,
        },

        validate: {
            keywords: hasLength(
                { min: 3 },
                'Enter a keyword of minimum length 3.'
            ),
            targetPrice: (val) => {
                if (typeof val !== 'number' || isNaN(val) || val < 0)
                    return 'Enter a valid number.';
                return null;
            },
        },
    });

    return (
        <form
            onSubmit={form.onSubmit(async (values) => await submit(values))}
            style={{ width: '100%' }}
        >
            <Grid gutter='sm' gutterMd='xl'>
                <Grid.Col md={6} lg={8}>
                    <TextInput
                        withAsterisk
                        label='Keywords'
                        placeholder='Enter Keywords'
                        description='Please enter the keywords'
                        {...form.getInputProps('keywords')}
                        rightSection={rightSection(
                            'These keywords are used for scraping'
                        )}
                    />
                </Grid.Col>
                <Grid.Col md={6} lg={4}>
                    <NumberInput
                        withAsterisk
                        label='Target Price'
                        placeholder='Enter Target Price'
                        description='Please enter the target price (min = 0)'
                        min={0}
                        step={1}
                        stepHoldDelay={500}
                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                        precision={2}
                        decimalSeparator='.'
                        icon={<IconCoin size='1rem' />}
                        {...form.getInputProps('targetPrice')}
                    />
                </Grid.Col>

                <Grid.Col mt='sm'>
                    <Button
                        type='submit'
                        color='green'
                        leftIcon={<IconPlayerPlayFilled />}
                    >
                        Start Scrape
                    </Button>
                </Grid.Col>
            </Grid>
        </form>
    );
}
