import React, { useEffect } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { useRouter } from 'next/router';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <NavBar />
            <div className="w-full justify-center mt-14">
                <div className="bg-theme-background w-full md:w-[611px] md:shadow-xl rounded-3xl py-8 px-4 md:py-8 md:px-12 md:my-8 md:mx-auto">
                    <div className="flex" />
                </div>
            </div>
            <Footer />
        </div>
    );
}) as React.FC;
