import React from 'react';
import { Skeleton, Box, Card, CardContent } from '@mui/material';

/**
 * Komponen untuk menampilkan loading state dengan skeleton
 * @param {object} props
 * @param {number} props.count - Jumlah skeleton yang ditampilkan
 * @param {string} props.variant - Variant (text, rectangular, circular)
 * @param {object} props.height - Tinggi skeleton
 * @param {boolean} props.withCard - Apakah membungkus dengan Card
 * @returns {JSX.Element}
 */
export default function SkeletonLoader({ 
  count = 3, 
  variant = 'rectangular', 
  height = 120, 
  withCard = true 
}) {
  const skeletons = Array(count).fill(0).map((_, index) => (
    <Box key={index} sx={{ mb: 2 }}>
      {withCard ? (
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Skeleton 
              variant={variant} 
              height={height} 
              animation="wave" 
              sx={{ mb: 1, borderRadius: 1 }} 
            />
            <Skeleton 
              variant="text" 
              width="60%" 
              height={20} 
              animation="wave" 
            />
            <Skeleton 
              variant="text" 
              width="40%" 
              height={20} 
              animation="wave" 
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Skeleton 
            variant={variant} 
            height={height} 
            animation="wave" 
            sx={{ mb: 1, borderRadius: 1 }} 
          />
          <Skeleton 
            variant="text" 
            width="60%" 
            height={20} 
            animation="wave" 
          />
          <Skeleton 
            variant="text" 
            width="40%" 
            height={20} 
            animation="wave" 
          />
        </>
      )}
    </Box>
  ));

  return <>{skeletons}</>;
} 