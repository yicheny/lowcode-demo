import { useState, useCallback } from 'react';

interface OpenInfo <TYPE>{
    type: TYPE | null; // Replace with the actual type of 'type'
    data?: any | null; // Replace with the actual type of 'data',
    [key:string]: any;
    // Add other properties of OpenInfo if needed
}

interface UseOpenResult<TYPE> {
    openInfo: OpenInfo<TYPE>;
    setOpenInfo: React.Dispatch<React.SetStateAction<OpenInfo<TYPE>>>;
    close: () => void;
    isOpen: (type: TYPE) => boolean;
    hasType: (types: TYPE[]) => boolean;
}

export function useOpen<TYPE>(initData: OpenInfo<TYPE> = { type: null, data: null }): UseOpenResult<TYPE> {
    const [openInfo, setOpenInfo] = useState(initData);

    const close = useCallback(() => setOpenInfo({ type: null, data: null }), []);

    const isOpen = useCallback((type: TYPE) => type === openInfo.type, [openInfo]);

    const hasType = useCallback((types: TYPE[]) => {
        if(openInfo.type === null) return false;
        return types.includes(openInfo.type);
    }, [openInfo]);

    return { openInfo, setOpenInfo, close, isOpen, hasType };
}
