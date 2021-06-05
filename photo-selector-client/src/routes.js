import React from 'react';

import Home from "./views/Home.jsx";

const TopPhotos = React.lazy(() => import('./views/PhotoAlbum.jsx'));

const routes = [
  {
    path: "/top-photos",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    exact: true,
    component: TopPhotos,
    layout: "/"
  },
  {
    path: "",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Home,
    layout: "/"
  },
];

export default routes;
