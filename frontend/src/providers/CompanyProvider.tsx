import { createContext, useContext, useRef, type FC, type ReactNode } from "react";

interface ICompanyProviderProps {
    children: ReactNode,
};

export interface ICompany {
    email: string;
    companyName: string;
    companyInformation: string;
    isMember: boolean;
}

interface ICompanyProviderInfo {
    setCompany: (company?: ICompany) => void
    getCompany: () => ICompany | undefined
}

const CompanyContext = createContext<ICompanyProviderInfo | null>(null);
const COMPANY_STORAGE_KEY = "csit314.company";

function getInitialCompany(): ICompany | undefined {
    if (typeof window === "undefined") {
        return undefined;
    }

    const storedCompany = window.localStorage.getItem(COMPANY_STORAGE_KEY);
    if (!storedCompany) {
        return undefined;
    }

    try {
        const parsed = JSON.parse(storedCompany) as Partial<ICompany>;
        if (
            typeof parsed.email !== "string" ||
            typeof parsed.companyName !== "string" ||
            typeof parsed.companyInformation !== "string"
        ) {
            window.localStorage.removeItem(COMPANY_STORAGE_KEY);
            return undefined;
        }

        return {
            email: parsed.email,
            companyName: parsed.companyName,
            companyInformation: parsed.companyInformation,
            isMember: parsed.isMember ?? false,
        };
    } catch {
        window.localStorage.removeItem(COMPANY_STORAGE_KEY);
        return undefined;
    }
}

export const CompanyProvider: FC<ICompanyProviderProps> = (props) => {
    const company = useRef<ICompany | undefined>(getInitialCompany());

    return (
        <CompanyContext.Provider value={{
            setCompany(c) {
                company.current = c;
                if (c) {
                    window.localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(c));
                } else {
                    window.localStorage.removeItem(COMPANY_STORAGE_KEY);
                }
            },
            getCompany() {
                return company.current
            },
        }}>
            {props.children}
        </CompanyContext.Provider>
    );
}

export function useCompanyState() {
    const context = useContext(CompanyContext);

    if (!context)
        throw new Error('useCompanyState must be used within the CompanyProvider!');

    return context;
}
