'use client';
import React from 'react';
import AppComponentHeader from '@crema/components/AppComponentHeader';
import AppGridContainer from '@crema/components/AppGridContainer';
import Grid from '@mui/material/Grid';
import AppComponentCard from '@crema/components/AppComponentCard';
import SimpleMap from './Simple';
import MapDirections from './Directions';
import MapClustering from './MapClustering';
import SimpleMapSource from '!raw-loader!././Simple';
import MapDirectionsSource from '!raw-loader!././Directions';
import MapClusteringSource from '!raw-loader!././MapClustering';

const GoogleMap = () => {
  return (
    <>
      <AppComponentHeader
        title='Google Map'
        description='A wrapper around google.maps.Map'
        refUrl='https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map/'
      />

      <AppGridContainer>
        <Grid item xs={12}>
          <AppComponentCard
            title='Simple Map'
            component={SimpleMap}
            source={SimpleMapSource}
          />
        </Grid>
        <Grid item xs={12}>
          <AppComponentCard
            title='Marker Clusterer Map'
            component={MapClustering}
            source={MapClusteringSource}
          />
        </Grid>

        <Grid item xs={12}>
          <AppComponentCard
            title='Directions Map'
            component={MapDirections}
            source={MapDirectionsSource}
          />
        </Grid>
      </AppGridContainer>
    </>
  );
};

export default GoogleMap;
