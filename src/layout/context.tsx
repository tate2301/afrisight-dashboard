import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type GeneralLayoutContextType = {
    pageTitle: string;
    setPageTitle: (title: string) => void;
};

const GeneralLayoutContext = createContext<GeneralLayoutContextType | undefined>(undefined);

const useGeneralLayoutContext = () => {
    const context = useContext(GeneralLayoutContext);
    if (!context) {
        throw new Error("useGeneralLayoutContext must be used within a GeneralLayoutProvider");
    }
    return context;
};

const useSetPageTitle = (title: string) => {
    const { setPageTitle } = useGeneralLayoutContext();

    useEffect(() => {
        setPageTitle(title);
    }, [title, setPageTitle]);
}

const GeneralLayoutProvider = ({ children }: { children: ReactNode }) => {
    const [pageTitle, setPageTitle] = useState("Dashboard");


    return <GeneralLayoutContext.Provider value={{
        pageTitle,
        setPageTitle,
    }}>{children}</GeneralLayoutContext.Provider>;
};

export { GeneralLayoutProvider, useGeneralLayoutContext, useSetPageTitle };