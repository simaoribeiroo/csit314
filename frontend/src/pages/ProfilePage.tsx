import { FC, FormEvent, KeyboardEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "../providers/UserProvider";

interface IProfilePageProps {}

const candidatePreview = {
  fullName: "Candidate name",
  email: "example@email.com",
  phone: "04XXXXXXXX",
  degree: "Degree name",
  university: "University of Wollongong",
  experience: "5",
  workExperience: "Backend internship and junior API development experience",
  preferredMode: "Hybrid",
  preferredLocation: "Wollongong",
  membership: "Premium",
  skills: ["Skill 1", "Skill 2", "Skill 3"],
};

const companyPreview = {
  companyName: "Company name",
  email: "example@email.com",
  contact: "example@email.com",
  summary:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur libero tortor, ut lacinia dui tristique nec. Pellentesque sed lorem ut mauris facilisis aliquet. Vestibulum porttitor neque felis, in interdum leo efficitur sit amet. Sed efficitur consectetur turpis, eu lacinia eros maximus vel. Morbi orci nunc, sollicitudin sit amet egestas ac, ornare nec sem.",
  membership: "Premium",
  activeRoles: "4 open roles",
  hiringModes: "Remote, Hybrid, On-site",
  locations: "Wollongong",
  postedJobs: [
    {
      title: "Job title",
      companyInformation: "Company name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur libero tortor, ut lacinia dui tristique nec. Pellentesque sed lorem ut mauris facilisis aliquet. Vestibulum...",
      requiredEducation: "Computer Science",
      requiredSkills: "Python, Django, PostgreSQL, REST",
      mode: "Work mode",
      location: "Location",
      experience: "1+ years",
    },
    {
      title: "Job title",
      companyInformation: "Company name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur libero tortor, ut lacinia dui tristique nec. Pellentesque sed lorem ut mauris facilisis aliquet. Vestibulum...",
      requiredEducation: "Information Systems",
      requiredSkills: "JavaScript, React, CSS, TypeScript",
      mode: "Work mode",
      location: "Location",
      experience: "2+ years",
    },
    {
      title: "Job title",
      companyInformation: "Company name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur libero tortor, ut lacinia dui tristique nec. Pellentesque sed lorem ut mauris facilisis aliquet. Vestibulum...",
      requiredEducation: "Computer Engineering",
      requiredSkills: "Linux, AWS, Networking, Scripting",
      mode: "Work mode",
      location: "Location",
      experience: "1+ years",
    },
    {
      title: "Job title",
      companyInformation: "Company name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur libero tortor, ut lacinia dui tristique nec. Pellentesque sed lorem ut mauris facilisis aliquet. Vestibulum...",
      requiredEducation: "Computer Engineering",
      requiredSkills: "Linux, AWS, Networking, Scripting",
      mode: "Work mode",
      location: "Location",
      experience: "1+ years",
    },
    {
      title: "Job title",
      companyInformation: "Company name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur libero tortor, ut lacinia dui tristique nec. Pellentesque sed lorem ut mauris facilisis aliquet. Vestibulum...",
      requiredEducation: "Computer Engineering",
      requiredSkills: "Linux, AWS, Networking, Scripting",
      mode: "Work mode",
      location: "Location",
      experience: "1+ years",
    },
    {
      title: "Job title",
      companyInformation: "Company name",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur libero tortor, ut lacinia dui tristique nec. Pellentesque sed lorem ut mauris facilisis aliquet. Vestibulum...",
      requiredEducation: "Computer Engineering",
      requiredSkills: "Linux, AWS, Networking, Scripting",
      mode: "Work mode",
      location: "Location",
      experience: "1+ years",
    },
  ],
};

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
  return (
    <section className="candidate-figma-shell">
      <div className="candidate-figma-card">
        <div className="candidate-figma-header">
          <h1>{candidatePreview.fullName}</h1>
          <button type="button" className="candidate-membership-button">
            Buy membership
          </button>
        </div>
        <div className="candidate-figma-details">
          <div className="candidate-figma-field">
            <h2>Email</h2>
            <p>{candidatePreview.email}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>Phone</h2>
            <p>{candidatePreview.phone}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>YOE</h2>
            <p>{candidatePreview.experience}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>Degree name</h2>
            <p>{candidatePreview.degree}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>University attended</h2>
            <p>{candidatePreview.university}</p>
          </div>
          <div className="candidate-figma-field">
            <h2>Skills</h2>
            <p>{candidatePreview.skills.join(", ")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompanyProfileCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <NewJobPostingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <section className="company-figma-shell">
        <div className="company-figma-card">
          <div className="company-figma-header">
            <h1>{companyPreview.companyName}</h1>
            <button type="button" className="candidate-membership-button">
              Buy membership
            </button>
          </div>

          <div className="company-figma-section">
            <h2>Company information</h2>
            <p>{companyPreview.summary}</p>
          </div>

          <div className="company-figma-section">
            <h2>Contact information</h2>
            <p>{companyPreview.contact}</p>
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
            {companyPreview.postedJobs.map((job, index) => (
              <article key={`${job.title}-${index}`} className="company-posting-card">
                <h3>{job.title}</h3>
                <p className="company-posting-company">{job.companyInformation}</p>
                <p className="company-posting-description">{job.description}</p>
                <p className="company-posting-meta">
                  {job.mode} | {job.location}
                </p>
              </article>
            ))}
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
        {isCompany == false ? <CompanyProfileCard /> : <CandidateProfileCard />}
      </div>
    </section>
  );
};
