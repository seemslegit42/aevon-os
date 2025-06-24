
"use client";

import React from 'react';
import { useLayoutStore } from '@/stores/layout.store';
import { shallow } from 'zustand/shallow';
import DashboardWindow from '@/components/dashboard-window';

export const DesktopDashboard: React.FC = () => {
    const { layoutItems, focusedItemId } = useLayoutStore(
        (state) => ({
            layoutItems: state.layoutItems,
            focusedItemId: state.focusedItemId,
        }),
        shallow
    );

    return (
        <>
            {layoutItems.map(item => (
                <DashboardWindow
                    key={item.id}
                    item={item}
                    isFocused={item.id === focusedItemId}
                />
            ))}
        </>
    );
};
