import React from 'react';
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import headerStyles from './header.module.css';

interface HeaderProps {
    isAuthentficated: boolean;
}

function Header({ isAuthentficated }: HeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();



    const handleProfileClick = () => {
        if (!isAuthentficated) {
            navigate('/login', { state: { from: location } });
        } else {
            navigate('/profile');
        }
    };

    return (
        <header className={headerStyles.header}>
            <nav className={headerStyles.header__navigation}>
                <div className={headerStyles.header__double_elements}>
                    <div className={`p-2 ${headerStyles.header__pair_elements}`}>
                        <BurgerIcon type={location.pathname === '/' ? 'primary' : 'secondary'} />
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `text text_type_main-default header__icons_text ${isActive ? headerStyles.header__icons_text_active : headerStyles.header__icons_text}`
                            }
                        >
                            Конструктор
                        </NavLink>
                    </div>
                    <div className={`p-2 ${headerStyles.header__pair_elements}`}>
                        <ListIcon type={location.pathname === '/feed' ? 'primary' : 'secondary'} />
                        <NavLink
                            to="/feed"
                            className={({ isActive }) =>
                                `text text_type_main-default header__icons_text ${isActive ? headerStyles.header__icons_text_active : headerStyles.header__icons_text}`
                            }
                        >
                            Лента заказов
                        </NavLink>
                    </div>
                </div>
                <div className={headerStyles.header__logo_wrapper}>
                    <a href='/'>
                    <Logo />
                    </a>
                </div>
                <div className={`p-2 ${headerStyles.header__pair_elements}`} onClick={handleProfileClick}>
                    <ProfileIcon type={location.pathname.startsWith('/profile') ? 'primary' : 'secondary'} />
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `text text_type_main-default header__icons_text ${isActive ? headerStyles.header__icons_text_active : headerStyles.header__icons_text}`
                        }
                    >
                        Личный кабинет
                    </NavLink>
                </div>
            </nav>
        </header>
    );
}

export { Header };
