import React from 'react';
import { Header } from './header'
import { Footer } from './footer'
import { Outlet } from 'react-router-dom';

const Content = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12"> {/* centers content */}
                    <Header />
                    <main>
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export { Content }