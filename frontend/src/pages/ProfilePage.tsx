import { FC, FormEvent, KeyboardEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "../providers/UserProvider";

interface IProfilePageProps {}

const candidatePreview = {
  fullName: "John Doe",
  email: "candidate1@example.com",
  phone: "+65 9123 4567",
  degree: "Computer Science",
  university: "University of Wollongong",
  experience: "2 years",
  workExperience: "Backend internship and junior API development experience",
  preferredMode: "Hybrid",
  preferredLocation: "Wollongong",
  membership: "Premium",
  skills: ["Python", "Django", "SQL", "Git", "REST APIs"],
};

const companyPreview = {
  companyName: "TechCorp",
  email: "company1@example.com",
  contact: "+65 6000 1111",
  summary:
    "A product-focused software company building internal tools and customer-facing platforms.",
  membership: "Premium",
  activeRoles: "4 open roles",
  hiringModes: "Remote, Hybrid, On-site",
  locations: "Wollongong",
  postedJobs: [
    {
      title: "Junior Backend Developer",
      companyInformation:
        "A product-focused software company building internal tools and customer-facing platforms.",
      description:
        "Build and maintain REST APIs, work with relational databases, and support deployment pipelines.",
      requiredEducation: "Computer Science",
      requiredSkills: "Python, Django, PostgreSQL, REST",
      mode: "Hybrid",
      location: "Wollongong",
      experience: "1+ years",
    },
    {
      title: "Frontend Engineer",
      companyInformation:
        "A product-focused software company building internal tools and customer-facing platforms.",
      description:
        "Develop responsive interfaces, collaborate with designers, and maintain reusable components.",
      requiredEducation: "Information Systems",
      requiredSkills: "JavaScript, React, CSS, TypeScript",
      mode: "Remote",
      location: "Wollongong",
      experience: "2+ years",
    },
    {
      title: "Cloud Support Associate",
      companyInformation:
        "A product-focused software company building internal tools and customer-facing platforms.",
      description:
        "Support cloud-hosted applications, troubleshoot issues, and document operational processes.",
      requiredEducation: "Computer Engineering",
      requiredSkills: "Linux, AWS, Networking, Scripting",
      mode: "On-site",
      location: "Wollongong",
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
  const navigate = useNavigate();

  return (
    <>
      <div className="page-header">
        <div className="profile-header-row">
          <div>
            <span className="eyebrow">Candidate Profile</span>
            <h1>{candidatePreview.fullName}</h1>
          </div>
          <button type="button" className="profile-back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      <section className="profile-hero-grid">
        <article className="profile-hero-card">
          <span>Membership</span>
          <strong>{candidatePreview.membership}</strong>
          <p>Unlimited job recommendations available for this account.</p>
        </article>
        <article className="profile-hero-card">
          <span>Years of Experience</span>
          <strong>{candidatePreview.experience}</strong>
          <p>{candidatePreview.degree}</p>
        </article>
        <article className="profile-hero-card">
          <span>Preferred Working Mode</span>
          <strong>{candidatePreview.preferredMode}</strong>
          <p>{candidatePreview.preferredLocation}</p>
        </article>
      </section>

      <section className="profile-grid">
        <article className="profile-panel">
          <h2>Profile Details</h2>
          <div className="profile-detail-list">
            <div>
              <span>Email</span>
              <strong>{candidatePreview.email}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{candidatePreview.phone}</strong>
            </div>
            <div>
              <span>University</span>
              <strong>{candidatePreview.university}</strong>
            </div>
            <div>
              <span>Degree</span>
              <strong>{candidatePreview.degree}</strong>
            </div>
            <div>
              <span>Work Experience</span>
              <strong>{candidatePreview.workExperience}</strong>
            </div>
          </div>
        </article>

        <article className="profile-panel">
          <h2>Skills</h2>
          <div className="profile-chip-list">
            {candidatePreview.skills.map((skill) => (
              <span key={skill} className="profile-chip">
                {skill}
              </span>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function CompanyProfileCard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <NewJobPostingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="page-header">
        <div className="profile-header-row">
          <div>
            <span className="eyebrow">Company Profile</span>
            <h1>{companyPreview.companyName}</h1>
          </div>
          <button type="button" className="profile-back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      <section className="profile-hero-grid">
        <article className="profile-hero-card company">
          <span>Membership</span>
          <strong>{companyPreview.membership}</strong>
          <p>Unlimited candidate recommendations available for recruiters.</p>
        </article>
        <article className="profile-hero-card company">
          <span>Active Roles</span>
          <strong>{companyPreview.activeRoles}</strong>
          <p>{companyPreview.locations}</p>
        </article>
        <article className="profile-hero-card company">
          <span>Work Modes</span>
          <strong>{companyPreview.hiringModes}</strong>
          <p>{companyPreview.locations}</p>
        </article>
      </section>

      <section>
        <article className="profile-panel">
          <h2>Company Details</h2>
          <div className="profile-detail-list">
            <div>
              <span>Email</span>
              <strong>{companyPreview.email}</strong>
            </div>
            <div>
              <span>Contact</span>
              <strong>{companyPreview.contact}</strong>
            </div>
            <div>
              <span>Primary Location</span>
              <strong>{companyPreview.locations}</strong>
            </div>
            <div>
              <span>About</span>
              <strong>{companyPreview.summary}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="profile-panel">
        <div className="profile-section-header">
          <h2>Posted Job Postings</h2>
          <button
            type="button"
            className="profile-action-button"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Job Posting
          </button>
        </div>
        <div className="profile-job-list">
          {companyPreview.postedJobs.map((job) => (
            <article key={job.title} className="profile-job-card">
              <div className="profile-job-card-main">
                <strong>{job.title}</strong>
                <p>{job.companyInformation}</p>
                <p>{job.description}</p>
                <p>
                  Required education: {job.requiredEducation}
                </p>
                <p>Required skills: {job.requiredSkills}</p>
                <p>Years of experience: {job.experience}</p>
                <p>Work mode: {job.mode}</p>
                <p>Job location: {job.location}</p>
              </div>
            </article>
          ))}
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
      <div className="page-card profile-page-card">
        {isCompany ? <CompanyProfileCard /> : <CandidateProfileCard />}
      </div>
    </section>
  );
};
