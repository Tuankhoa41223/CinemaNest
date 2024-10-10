import { comma } from "postcss/lib/list";
import AdminCategory from "../pages/admin/elements/AdminCategory";
import { Component } from "react";
import Dashboard from "../pages/admin/elements/Dashboard";
import Movies from "../pages/admin/moviepage/Movies";
import Episoder from "../pages/admin/moviepage/Episoder";
import Trailers from "../pages/admin/moviepage/Trailers"
import User from "../pages/admin/watchlistpage/User";
import Actor from "../pages/admin/characterpage/Actor";
import Author from "../pages/admin/characterpage/Author";
import Character from "../pages/admin/characterpage/Characters";
import Watchlist from "../pages/admin/watchlistpage/Watchlist";
import Rating from "../pages/admin/watchlistpage/Rating";
import Features from "../pages/admin/giftpage/Features";
import Plan from "../pages/admin/giftpage/Plans";
import Package from "../pages/admin/giftpage/Packages";

const RouterAdmin = [
    {
        path:'/',
        Component:Dashboard
    },
    {
        path: '/categories',
        Component: AdminCategory
    },
    {
        path:'/movies',
        Component:Movies
  
    },
    {
        path: '/episoder',
        Component:Episoder
    },
    {
        path: '/user',
        Component:User
    },
    {
        path: '/trailers',
        Component:Trailers
    },
    {
        path: '/actor',
        Component:Actor
    },
    {
        path: '/author',
        Component:Author
    },
    {
        path: '/watchlist',
        Component:Watchlist
    },
    {
        path: '/rating',
        Component:Rating
    },
    {
        path: '/character',
        Component:Character
    },

    {
        path: '/feature',
        Component:Features
    },
    {
        path: '/plan',
        Component:Plan
    },
    {
        path: '/package',
        Component:Package
    }

]
   
export default RouterAdmin;