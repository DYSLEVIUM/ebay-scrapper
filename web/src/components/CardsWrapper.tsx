import { Box, Grid, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Card } from '.';
import { getDataIntervalSec } from '../shared/constants/apiURLs';
import Product from '../shared/interfaces/Product';
import { getScrappedData } from '../shared/utils/api';

export default function CardsWrapper() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // initial call
        (async () => {
            setProducts(await getScrappedData());
        })();

        // http polling for new products
        const interval = setInterval(async () => {
            setProducts(await getScrappedData());
        }, getDataIntervalSec * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <Box
            sx={() => ({
                transition: 'all 250ms ease',
            })}
        >
            {!products || products.length === 0 ? (
                <Text>No New Items</Text>
            ) : (
                <>
                    <Text fz='sm' mb='lg'>
                        These are the new items for the keywords: Nvidia GPU
                        3060.
                    </Text>
                    <Grid gutter='xl'>
                        {products.map((product) => {
                            return (
                                <Grid.Col
                                    md={4}
                                    sm={6}
                                    xs={12}
                                    key={product.link}
                                >
                                    <Card
                                        title={product.title}
                                        price={product.price}
                                        imageLink={product.image_link}
                                        condition={product.condition}
                                        link={product.link}
                                        shippingPrice={product.shipping_price}
                                    />
                                </Grid.Col>
                            );
                        })}
                    </Grid>
                </>
            )}
        </Box>
    );
}
