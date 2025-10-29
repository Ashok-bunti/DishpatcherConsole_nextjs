import React from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Button from '@mui/material/Button';
import './index.css';

const features = [
  {
    name: 'Documentation',
    img: '/assets/images/features/documentation.svg',
    description: 'Available our detailed document and top call support here.',
    but: 'Check Document',
    link: '/',
  },
  {
    name: 'GitHub',
    img: '/assets/images/features/git-hub.svg',
    description: 'Get latest feature, make pull request or bug fixes.',
    but: 'Join on GitHub',
    link: '/',
  },
  {
    name: 'Slack',
    img: '/assets/images/features/slack.svg',
    description:
      'Share your idea and insights, for inspiration collaboration and great result.',
    but: 'Join Our Community',
    link: '/',
  },
];
const Features = () => {
  return (
    <section className='features_section'>
      <Box>
        <h3
          style={{
            // fontSize: '48px',
            color: '#0090f1',
            fontWeight: 'bold',
          }}
        >
          Crema Theme
        </h3>
        <h2 style={{ fontSize: '30px', fontWeight: 'bold' }}>
          Crema Theme is a great kick-starter
        </h2>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '32px',
          fontSize: '16px',
          padding: '30px 0',
        }}
      >
        {features.map((item) => (
          <div key={item.name} className='features'>
            <Box
              sx={{
                // color: '#757575',
                background: `url(/assets/images/features/bg.svg) no-repeat bottom center  `,
                // backgroundSize: '100% 100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
              }}
            >
              <Image
                src={item.img}
                alt={item.name}
                width={200}
                height={220}
                style={{
                  '& : hover': { transform: `rotate(15deg)` },
                }}
              />
            </Box>

            <h3
              className='featured_title'
              style={{
                fontWeight: 'bold',
              }}
            >
              {item.name}
            </h3>
            <p style={{ color: '#757575' }}>{item.description}</p>
            <Button
              variant='contained'
              sx={{
                padding: '10px 30px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {item.but}
            </Button>
          </div>
        ))}
      </Box>
    </section>
  );
};

export default Features;
