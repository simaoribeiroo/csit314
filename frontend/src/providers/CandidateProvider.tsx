import { createContext, useContext, useRef, type FC, type ReactNode } from "react";

interface ICandidateProviderProps {
    children: ReactNode,
};

export interface ICandidate {
    email: string;
    fullName: string;
    phoneNumber: string;
    university: string;
    degreeName: string;
    yearsOfExperience: number;
    skills: string[];
    preferredWorkingMode: string;
    preferredLocation: string;
}

interface ICandidateProviderInfo {
    setCandidate: (c?: ICandidate) => void
    getCandidate: () => ICandidate | undefined
}

const CandidateContext = createContext<ICandidateProviderInfo | null>(null);
const CANDIDATE_STORAGE_KEY = "csit314.candidate";

function getInitialCandidate(): ICandidate | undefined {
    if (typeof window === "undefined") {
        return undefined;
    }

    const stored = window.localStorage.getItem(CANDIDATE_STORAGE_KEY);
    if (!stored) return undefined;

    try {
        const parsed = JSON.parse(stored) as Partial<ICandidate>;
        if (typeof parsed.email !== "string") {
            window.localStorage.removeItem(CANDIDATE_STORAGE_KEY);
            return undefined;
        }

        const rawSkills = (parsed as any).skills
        const skills = Array.isArray(rawSkills)
            ? (rawSkills as string[])
            : typeof rawSkills === 'string'
            ? rawSkills.split(',').map((s: string) => s.trim()).filter(Boolean)
            : []

        return {
            email: parsed.email,
            fullName: parsed.fullName ?? '',
            phoneNumber: parsed.phoneNumber ?? '',
            university: parsed.university ?? '',
            degreeName: parsed.degreeName ?? '',
            yearsOfExperience: parsed.yearsOfExperience ?? 0,
            skills,
            preferredWorkingMode: parsed.preferredWorkingMode ?? '',
            preferredLocation: parsed.preferredLocation ?? '',
        };
    } catch {
        window.localStorage.removeItem(CANDIDATE_STORAGE_KEY);
        return undefined;
    }
}

export const CandidateProvider: FC<ICandidateProviderProps> = (props) => {
    const candidate = useRef<ICandidate | undefined>(getInitialCandidate());

    return (
        <CandidateContext.Provider value={{
            setCandidate(c) {
                candidate.current = c;
                if (c) {
                    window.localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(c));
                } else {
                    window.localStorage.removeItem(CANDIDATE_STORAGE_KEY);
                }
            },
            getCandidate() {
                return candidate.current
            },
        }}>
            {props.children}
        </CandidateContext.Provider>
    );
}

export function useCandidateState() {
    const context = useContext(CandidateContext);
    if (!context) throw new Error('useCandidateState must be used within the CandidateProvider!');
    return context;
}
