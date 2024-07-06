import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

import photoURL from '../../assets/home/girl.jpg';  // L'importation de la photo de profil dashboard de l'utilisateur

const navLinks = [
    {
        name: "Home",
        route: "/"
    },
    {
        name: 'Instructors',
        route: '/instructors'
    },
    {
        name: 'Classes',
        route: '/classes'
    }
];

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff0000',
        },
        secondary: {
            main: '#00ff00',
        },
    },
});

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isHome, setIsHome] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isFixed, setIsFixed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [navBg, setNavBg] = useState('bg-[#15151580]'); 
    const user = true; // TODO: check if user is logged in

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const darkClass = 'dark';
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add(darkClass);
        } else {
            root.classList.remove(darkClass);
        }
    }, [isDarkMode]);

    useEffect(() => {
        setIsHome(location.pathname === '/');
        setIsLogin(location.pathname === '/login');
        setIsFixed(location.pathname === '/register' || location.pathname === '/login');
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = window.pageYOffset;
            setScrollPosition(currentPosition);
        };

        window.addEventListener('scroll', handleScroll);
        return () => 
            window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (scrollPosition > 100) {
            if (isHome) {
                setNavBg('bg-white backdrop-filter backdrop-blur-xl bg-opacity-0 dark:text-white text-black');
            } else {
                setNavBg('bg-white dark:bg-black dark:text-white text-black');
            } 
        } else {
            setNavBg(`${isHome || location.pathname === '/' ? 'bg-transparent' : 'bg-white dark:bg-black'} dark:text-white text-white`);
        }
    }, [scrollPosition, isHome, location.pathname]);

    const handelLogout = () => {
        console.log('Logout out');
    }

    return (
        <nav className="">
            <div className='lg:w-[80%] mx-auto sm:px-4 lg:px-6'>
                <div className='px-4 py-4 flex items-center justify-between'>
                    {/* Logo container */}
                    <div>
                        <h1 className='text-2xl inline-flex gap-3 items-center font-bold'>
                            IntraConnect <img src="/yoga-logo.png" alt="" className='w-8 h-8' />
                        </h1>
                        <p className='font-bold text-[13px] tracking-[8px]'>Explore Intranet</p>
                    </div>
                    {/* Navigation links */}
                    <div className='hidden md:block text-black dark:text-white'>
                        <div className='flex'>
                            <ul className='ml-10 flex items-center space-x-4 pr-4'>
                                {navLinks.map((link) => (
                                    <li key={link.route}>
                                        <NavLink
                                            to={link.route}
                                            className={({ isActive }) =>
                                                `font-bold ${isActive ? 'text-secondary' : `${navBg.includes('bg-transparent') ? 'text-white' : 'text-black dark:text-white'}`} hover:text-secondary duration-300`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                                {/* Inscription */}
                                {user ? null : (
                                    isLogin ? (
                                        <li>
                                            <NavLink 
                                                to="/register"
                                                className={({ isActive }) =>
                                                    `font-bold ${isActive ? 'text-secondary' : `${navBg.includes('bg-transparent') ? 
                                                    'text-white' : 'text-black dark:text-white'}`} hover:text-secondary duration-300`
                                                }
                                            >
                                                Register
                                            </NavLink>
                                        </li>
                                    ) : (
                                        <li>
                                            <NavLink 
                                                to="/login"
                                                className={({ isActive }) =>
                                                    `font-bold ${isActive ? 'text-secondary' : `${navBg.includes('bg-transparent') ? 
                                                    'text-white' : 'text-black dark:text-white'}`} hover:text-secondary duration-300`
                                                }
                                            >
                                                Login
                                            </NavLink>
                                        </li>
                                    )
                                )}
                                {/* Dashboard */}
                                {user && (
                                    <li>
                                        <NavLink 
                                            to='/dashboard' 
                                            className={({ isActive }) =>
                                                `font-bold ${isActive ? 'text-secondary' : `${navBg.includes('bg-transparent') ? 'text-white' : 'text-black dark:text-white'}`} hover:text-secondary duration-300`
                                            }
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                )}
                                {
                                    // Le code qui permet d'afficher la photo à gauche de l'utilisateur connecté dans le dashboard
                                    user && <li>
                                        <img src={photoURL} alt="" className='h-[40px] rounded-full w-[40px]' />
                                    </li>
                                }
                                {
                                    user && <li><NavLink onClick={handelLogout} className={'font-bold px-3 py-2 bg-secondary text-white'}>Logout</NavLink></li>
                                }
                                {/* Toggle couleur */}
                                <li>
                                    <ThemeProvider theme={theme}>
                                        <div className='flex flex-col justify-center items-center'>
                                            <Switch onChange={() => setIsDarkMode(!isDarkMode)} />
                                        </div>
                                    </ThemeProvider>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
