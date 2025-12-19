import React, { Suspense, lazy } from 'react';

const Music = lazy(() => import('../components/music'));

const MusicPage: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading music...</div>}>
            <Music />
        </Suspense>
    );
};

export default MusicPage;
