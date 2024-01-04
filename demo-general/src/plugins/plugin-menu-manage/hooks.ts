import { useState, useCallback } from 'react';

interface OpenInfo {
    type: string | null; // Replace with the actual type of 'type'
    data?: any | null; // Replace with the actual type of 'data'
    // Add other properties of OpenInfo if needed
}

interface UseOpenResult {
    openInfo: OpenInfo;
    setOpenInfo: React.Dispatch<React.SetStateAction<OpenInfo>>;
    close: () => void;
    isOpen: (type: string) => boolean;
}

export function useOpen(initData: OpenInfo = { type: null, data: null }): UseOpenResult {
    const [openInfo, setOpenInfo] = useState(initData);

    const close = useCallback(() => setOpenInfo({ type: null, data: null }), []);

    const isOpen = useCallback((type: string) => type === openInfo.type, [openInfo]);

    return { openInfo, setOpenInfo, close, isOpen };
}
