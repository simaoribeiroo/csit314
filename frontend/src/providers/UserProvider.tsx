import { createContext, useContext, useRef, type FC, type ReactNode } from "react";
interface IUserProviderProps {
    children: ReactNode,
};
export interface IUser {
    email: string;
    accountType: string;

}
interface IUserProviderInfo {
    setUser: (user?: IUser) => void
    getUser: () => IUser | undefined
}

const UserContext = createContext<IUserProviderInfo | null>(null);
const USER_STORAGE_KEY = "csit314.user";

function getInitialUser(): IUser | undefined {
    if (typeof window === "undefined") {
        return undefined;
    }

    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!storedUser) {
        return undefined;
    }

    try {
        const parsed = JSON.parse(storedUser) as Partial<IUser>;
        if (typeof parsed.email !== "string" || typeof parsed.accountType !== "string") {
            window.localStorage.removeItem(USER_STORAGE_KEY);
            return undefined;
        }

        return {
            email: parsed.email,
            accountType: parsed.accountType,
        };
    } catch {
        window.localStorage.removeItem(USER_STORAGE_KEY);
        return undefined;
    }
}

export const UserProvider: FC<IUserProviderProps> = (props) => {
    const user = useRef<IUser | undefined>(getInitialUser());

    return (
        <UserContext.Provider value={{
            setUser(u) {
                user.current=u;
                if (u) {
                    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
                } else {
                    window.localStorage.removeItem(USER_STORAGE_KEY);
                }

                if (!u)
                    window.dispatchEvent(new Event("loggedOut"));
                else
                    window.dispatchEvent(new Event("loggedIn"));
            },
            getUser() {
                return user.current
            },
        }}>
            {props.children}
        </UserContext.Provider>
    );
}

export function useUserState() {
    const context = useContext(UserContext);

    if (!context)
        throw new Error('useUserState must be used within the UserProvider!');

    return context;
}