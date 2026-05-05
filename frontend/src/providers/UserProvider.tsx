import { createContext, useContext, useRef, type FC, type ReactNode } from "react";
interface IUserProviderProps {
    children: ReactNode,
};
export interface IUser {

}
interface IUserProviderInfo {
    setUser: (user?: IUser) => void
    getUser: () => IUser | undefined
}

const UserContext = createContext<IUserProviderInfo | null>(null);

export const UserProvider: FC<IUserProviderProps> = (props) => {
    const user = useRef<IUser>(undefined);

    return (
        <UserContext.Provider value={{
            setUser(u) {
                user.current=u;
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
        throw new Error('useUserState must be used within the ModalsProvider!');

    return context;
}