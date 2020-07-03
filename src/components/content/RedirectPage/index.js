import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

const RedirectPage = ({ location }) => {
  console.log("log location", location);
  

  return <Redirect to={{ pathname: location.link, state: { data: location.relatedVideos } }} />;
};

export default RedirectPage;
