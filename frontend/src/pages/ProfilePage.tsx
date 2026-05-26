import { FC, FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { useCandidateState, type ICandidate } from "../providers/CandidateProvider";
import { useCompanyState } from "../providers/CompanyProvider";
import { useUserState } from "../providers/UserProvider";

interface IProfilePageProps {}

interface ICompanyJobPosting {
  id: number;
  title: string;
  company: string;
  description: string;
  workMode: string;
  location: string;
  contactEmail: string;
}

function NewJobPostingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workMode, setWorkMode] = useState("Hybrid");
  const [requiredYoe, setRequiredYoe] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(["Skill", "Skill", "Skill"]);
  const [requiredDegree, setRequiredDegree] = useState("");
  const [location, setLocation] = useState("");

  if (!isOpen) {
    return null;
  }

  function handleAddSkill() {
    const trimmedSkill = skillInput.trim();

    if (!trimmedSkill) {
      return;
    }

    setSkills((current) => [...current, trimmedSkill]);
    setSkillInput("");
  }

  function handleRemoveSkill(indexToRemove: number) {
    setSkills((current) => current.filter((_, index) => index !== indexToRemove));
  }

  function handleSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    console.log("New job posting preview:", {
      jobTitle,
      description,
      workMode,
      requiredYoe,
      skills,
      requiredDegree,
      location,
    });

    onClose();
  }

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div
        className="profile-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-job-posting-title"
      >
        <div className="profile-modal-header">
          <button
            type="button"
            className="profile-modal-close"
            onClick={onClose}
            aria-label="Close popup"
          >
            ×
          </button>
        </div>

        <form className="profile-modal-form" onSubmit={handleSubmit}>
          <label>
            Job title
            <input
              type="text"
              placeholder="Job title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={4}
              required
            />
          </label>

          <div className="profile-modal-grid">
            <label>
              Work mode
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                required
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </label>

            <label>
              Required YOE
              <input
                type="text"
                value={requiredYoe}
                onChange={(e) => setRequiredYoe(e.target.value)}
                placeholder="YOE"
                required
              />
            </label>
          </div>

          <label>
            Required Skills
            <div className="profile-skill-input-row">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Skill"
              />
              <button
                type="button"
                className="profile-skill-add-button"
                onClick={handleAddSkill}
                aria-label="Add skill"
              >
                +
              </button>
            </div>
          </label>

          <div className="profile-added-skills">
            <span>Added skills:</span>
            <div className="profile-chip-list">
              {skills.map((skill, index) => (
                <button
                  key={`${skill}-${index}`}
                  type="button"
                  className="profile-chip profile-chip-button"
                  onClick={() => handleRemoveSkill(index)}
                  aria-label={`Remove ${skill}`}
                >
                  {skill}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
          </div>

          <label>
            Required Degree
            <input
              type="text"
              value={requiredDegree}
              onChange={(e) => setRequiredDegree(e.target.value)}
              placeholder="Degree name"
              required
            />
          </label>

          <label>
            Location
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              required
            />
          </label>

          <div className="profile-modal-actions">
            <button type="submit" className="profile-action-button">
              Create job posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CandidateProfileCard() {
  const userState = useUserState();
  const candidateState = useCandidateState();
  const user = userState.getUser();
  const storedCandidate = candidateState.getCandidate();
  const [candidate, setCandidate] = useState<ICandidate | undefined>(
    storedCandidate?.email === user?.email ? storedCandidate : undefined,
  );
  const [isLoading, setIsLoading] = useState(Boolean(user?.email));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.email) {
      setCandidate(undefined);
      setIsLoading(false);
      setError("No logged-in candidate found.");
      return;
    }

    if (user.accountType !== "candidate") {
      setCandidate(undefined);
      setIsLoading(false);
      setError("This profile page is only available for candidate accounts.");
      return;
    }

    let isActive = true;

    setIsLoading(true);
    setError("");

    fetch(`/api/candidate/${encodeURIComponent(user.email)}/`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load candidate profile.");
        }

        return response.json();
      })
      .then((data) => {
        if (!isActive) {
          return;
        }

        const nextCandidate: ICandidate = {
          email: data.email,
          fullName: data.full_name ?? "",
          phoneNumber: data.phone_number ?? "",
          university: data.university ?? "",
          degreeName: data.degree_name ?? "",
          yearsOfExperience: Number(data.years_of_experience) || 0,
          skills: Array.isArray(data.skills)
            ? data.skills
            : typeof data.skills === "string"
              ? data.skills
                  .split(",")
                  .map((skill: string) => skill.trim())
                  .filter(Boolean)
              : [],
          preferredWorkingMode: data.preferred_working_mode ?? "",
          preferredLocation: data.preferred_location ?? "",
        };

        candidateState.setCandidate(nextCandidate);
        setCandidate(nextCandidate);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setError("Unable to load candidate profile.");
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [candidateState, user?.accountType, user?.email]);

  if (isLoading) {
    return (
      <section className="candidate-figma-shell">
        <div className="candidate-figma-card">
          <div className="candidate-figma-header">
            <h1>Loading profile...</h1>
          </div>
        </div>
      </section>
    );
  }

  if (error || !candidate) {
    return (
      <section className="candidate-figma-shell">
        <div className="candidate-figma-card">
          <div className="candidate-figma-header">
            <h1>Candidate profile</h1>
          </div>
          <div className="candidate-figma-details">
            <div className="candidate-figma-field">
              <h2>Status</h2>
              <p>{error || "Candidate profile not found."}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="candidate-figma-shell">
      <div className="candidate-figma-card">
        <div className="candidate-figma-header">
          <h1>{candidate.fullName || "Candidate profile"}</h1>
          <button type="button" className="candidate-membership-button">
            Buy membership
          </button>
        </div>
        <div className="candidate-figma-details">
          <div className="candidate-figma-field">
            <h2>Email</h2>
            <p>{candidate.email}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>Phone</h2>
            <p>{candidate.phoneNumber || "Not provided"}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>YOE</h2>
            <p>{candidate.yearsOfExperience}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>Degree name</h2>
            <p>{candidate.degreeName || "Not provided"}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>University attended</h2>
            <p>{candidate.university || "Not provided"}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>Skills</h2>
            <p>{candidate.skills.length > 0 ? candidate.skills.join(", ") : "Not provided"}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>Preferred work mode</h2>
            <p>{candidate.preferredWorkingMode || "Not provided"}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>Preferred location</h2>
            <p>{candidate.preferredLocation || "Not provided"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompanyProfileCard() {
  const userState = useUserState();
  const companyState = useCompanyState();
  const user = userState.getUser();
  const storedCompany = companyState.getCompany();
  const matchingStoredCompany =
    storedCompany?.email === user?.email ? storedCompany : undefined;
  const [company, setCompany] = useState(
    matchingStoredCompany,
  );
  const [contactInformation, setContactInformation] = useState(
    matchingStoredCompany?.email ?? "",
  );
  const [jobs, setJobs] = useState<ICompanyJobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(user?.email));
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setCompany(undefined);
      setJobs([]);
      setIsLoading(false);
      setError("No logged-in company found.");
      return;
    }

    if (user.accountType !== "company") {
      setCompany(undefined);
      setJobs([]);
      setIsLoading(false);
      setError("This profile page is only available for company accounts.");
      return;
    }

    let isActive = true;

    setIsLoading(true);
    setError("");

    Promise.all([
      fetch(`/api/company/${encodeURIComponent(user.email)}/`),
      fetch("/api/jobs/search/"),
    ])
      .then(async ([companyResponse, jobsResponse]) => {
        if (!companyResponse.ok) {
          throw new Error("Unable to load company profile.");
        }

        if (!jobsResponse.ok) {
          throw new Error("Unable to load company job postings.");
        }

        const companyData = await companyResponse.json();
        const jobsData = await jobsResponse.json();
        return { companyData, jobsData };
      })
      .then(({ companyData, jobsData }) => {
        if (!isActive) {
          return;
        }

        const nextCompany = {
          email: companyData.email,
          companyName: companyData.company_name ?? "",
          companyInformation: companyData.company_information ?? "",
        };

        const nextJobs: ICompanyJobPosting[] = Array.isArray(jobsData.jobs)
          ? jobsData.jobs.filter((job: ICompanyJobPosting) => job.contactEmail === user.email)
          : [];

        companyState.setCompany(nextCompany);
        setCompany(nextCompany);
        setContactInformation(companyData.contact_information || companyData.email || "");
        setJobs(nextJobs);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setError("Unable to load company profile.");
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [companyState, user?.accountType, user?.email]);

  if (isLoading) {
    return (
      <section className="company-figma-shell">
        <div className="company-figma-card">
          <div className="company-figma-header">
            <h1>Loading profile...</h1>
          </div>
        </div>
      </section>
    );
  }

  if (error || !company) {
    return (
      <section className="company-figma-shell">
        <div className="company-figma-card">
          <div className="company-figma-header">
            <h1>Company profile</h1>
          </div>
          <div className="company-figma-section">
            <h2>Status</h2>
            <p>{error || "Company profile not found."}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <NewJobPostingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <section className="company-figma-shell">
        <div className="company-figma-card">
          <div className="company-figma-header">
            <h1>{company.companyName || "Company profile"}</h1>
            <button type="button" className="candidate-membership-button">
              Buy membership
            </button>
          </div>

          <div className="company-figma-section">
            <h2>Company information</h2>
            <p>{company.companyInformation || "Not provided"}</p>
          </div>

          <div className="company-figma-section">
            <h2>Contact information</h2>
            <p>{contactInformation || company.email}</p>
          </div>

          <div className="company-postings-header">
            <h2>Posted job postings</h2>
            <button
              type="button"
              className="company-add-posting-button"
              onClick={() => setIsModalOpen(true)}
            >
              Add job posting +
            </button>
          </div>

          <div className="company-postings-list">
            {jobs.length > 0 ? jobs.map((job) => (
              <article key={job.id} className="company-posting-card">
                <h3>{job.title}</h3>
                <p className="company-posting-company">{job.company}</p>
                <p className="company-posting-description">{job.description}</p>
                <p className="company-posting-meta">
                  {job.workMode} | {job.location}
                </p>
              </article>
            )) : (
              <article className="company-posting-card">
                <h3>No job postings yet</h3>
                <p className="company-posting-description">
                  This company does not have any posted jobs to show right now.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export const ProfilePage: FC<IProfilePageProps> = () => {
  const userState = useUserState();
  const user = userState.getUser();
  const isCompany = user?.accountType === "company";

  return (
    <section className="page-shell">
      <div className={`page-card profile-page-card ${isCompany ? "company-page-card" : "candidate-page-card"}`}>
        {isCompany ? <CompanyProfileCard /> : <CandidateProfileCard />}
      </div>
    </section>
  );
};
