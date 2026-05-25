import { type FC } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import styles from '../css/layout.module.css';
import { Banner } from "../components/Banner";
interface ILayoutProps { };

export const Layout: FC<ILayoutProps> = (_) => {
    return (
        <div className={styles.container}>
            <div className={styles.containerFullWindow}>
                <div className={styles.containerMain}>
                    <Banner />
                    <Outlet />
                    <ScrollRestoration />
                </div>
            </div>
        </div>
    );
}
