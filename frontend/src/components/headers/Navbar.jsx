import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

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

const Navbar = () => {
    const [navBg, setNavBg] = useState('bg-[#15151580]');
    const user = false;

    return (
        <nav>
            <div className='lg:w-[80%] mx-auto sm:px-4 lg:px-6'>
                <div className='px-4 py-4 flex items-center justify-between'>
                    {/* Logo container on ici c'est pour le logo */}
                    <div>
                        <h1 className='text-2xl inline-flex gap-3 items-center font-bold'>
                            IntraConnect <img src="/yoga-logo.png" alt="" className='w-8 h-8' />
                        </h1>
                        <p className='font-bold text-[13px] tracking-[8px]'>Explore Intranet</p>
                    </div>
                    {/* mobile menu icons */}
                    <div className='hidden md:block text-black dark:text-white'>
                        <div className='flex'>
                            <ul className='ml-10 flex items-center space-x-4 pr-4'>
                                {navLinks.map((link) => (
                                    <li key={link.route}>
                                        <NavLink
                                            to={link.route}
                                            className={({ isActive, isPending }) =>
                                                `font-bold ${isActive ? 'text-secondary' : `${navBg.includes('bg-transparent') ? 'text-white' : 'text-black dark:text-white'}`} hover:text-secondary duration-300`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                                {/* based on users */}
                                <li><NavLink to="/login"
                                    className={({ isActive, isPending }) =>
                                    `font-bold ${isActive ? 'text-secondary' : `${navBg.includes('bg-transparent') ? 'text-white' : 'text-black dark:text-white'}`} hover:text-secondary duration-300`
                                }>Login</NavLink></li>

                                {/* toogle */}
                                <li>Blanc/Sombre</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
