import { FC, forwardRef, useImperativeHandle, useRef, useState } from "react";
import styles from "../css/searchPage.module.css";
import buttonStyles from "../css/baseButton.module.css";
import { InputField, InputFieldHandle } from "../components/InputField";
import { BaseButton } from "../components/BaseButton";
import { Cross, Plus, Search } from "../components/Icons";

interface ISearchCandidatesPageProps { }

interface ICandidatePosting {
  id: number;
  name: string;
  email: string;
  phone: string;
  yoe: number;
  degree: string;
  university: string;
  skills: string[];
}

const CandidatePostingCard: FC<{ candidate: ICandidatePosting; onClick: () => void }> = ({ candidate, onClick }) => {
  return (
	<div className={styles.jobCard} onClick={onClick}>
	  <h2 className={styles.jobTitle}>{candidate.name}</h2>
	  <p className={styles.companyName}>{candidate.university}</p>
	  <p className={styles.jobDescription}>{candidate.degree}</p>
	  <p className={styles.jobMeta}>
		{candidate.yoe} years experience | {candidate.skills.join(", ")}
	  </p>
	</div>
  );
};

interface ICandidateDetailModalProps {
}
interface ICandidateDetailModalHandle {
  show: (candidate: ICandidatePosting) => void
}

const CandidateDetailModal = forwardRef<ICandidateDetailModalHandle, ICandidateDetailModalProps>((_, ref) => {
  const [candidate, setCandidate] = useState<ICandidatePosting | undefined>(undefined)
  const [isOpened, setIsOpened] = useState<boolean>(false);

  function onClose(e?: React.MouseEvent) {
	e?.preventDefault();
	setIsOpened(false);
  }

  useImperativeHandle(ref, () => ({
	show(candidate) {
	  setCandidate(candidate);
	  setIsOpened(true);
	},
  }));

  return (
	<div className={`${styles.modalOverlay} ${isOpened ? styles.open : styles.close}`} onClick={onClose}>
	  {candidate ?
		<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

		  <h1 className={styles.modalTitle}>{candidate.name}</h1>
		  <p className={styles.modalCompany}>{candidate.university}</p>

		  <section className={styles.modalSection}>
			<h3 className={styles.sectionTitle}>Email</h3>
			<p className={styles.sectionText}>{candidate.email}</p>
		  </section>

		  <section className={styles.modalSection}>
			<h3 className={styles.sectionTitle}>Phone</h3>
			<p className={styles.sectionText}>{candidate.phone}</p>
		  </section>

		  <section className={styles.modalSection}>
			<h3 className={styles.sectionTitle}>Years of experience</h3>
			<p className={styles.sectionText}>{candidate.yoe}</p>
		  </section>

		  <section className={styles.modalSection}>
			<h3 className={styles.sectionTitle}>Degree</h3>
			<p className={styles.sectionText}>{candidate.degree}</p>
		  </section>

		  <section className={styles.modalSection}>
			<h3 className={styles.sectionTitle}>Skills</h3>
			<p className={styles.sectionText}>{candidate.skills.join(", ")}</p>
		  </section>
		</div>
		: ""}
	</div>
  );
});

interface FilterPopupProps {
  onFiltersClose: (f: IFilters) => void
}
interface IFilterPopupHandle {
  show: (filters?: IFilters) => void
  getFilters: () => IFilters
}
interface IFilters {
  experience: string[],
  skills: string[],
  degree: string,
}

const FilterPopup = forwardRef<IFilterPopupHandle, FilterPopupProps>((props, ref) => {
  const [filters, setFilters] = useState<IFilters>({
	experience: [],
	skills: [],
	degree: ""
  })
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const skillInput = useRef<InputFieldHandle>(null)

  function onClose(e?: React.MouseEvent) {
	e?.preventDefault();
	props.onFiltersClose(filters);
	setIsOpened(false);
  }

  const toggleExperience = (exp: string) => {
	let nf = { ...filters };
	if (nf.experience.includes(exp))
	  nf.experience = nf.experience.filter((e) => e !== exp)
	else
	  nf.experience = [...nf.experience, exp]
	setFilters(nf);
  };

  const addSkill = (e: React.SubmitEvent<HTMLFormElement>) => {
	e.preventDefault();
	const data = Object.fromEntries(new FormData(e.currentTarget)) as any;
	if (data.skill == "") {
	  skillInput.current?.setError("Skill can't be empty.");
	  return;
	}
	if (filters.skills.includes(data.skill)) {
	  skillInput.current?.setError("This skill has already been added.");
	  return;
	}
	let nf = { ...filters };
	nf.skills.push(data.skill);
	setFilters(nf);
	e.currentTarget.reset();
  };

  const removeSkill = (skill: string) => {
	let nf = { ...filters };
	nf.skills = nf.skills.filter(s => s != skill);
	setFilters(nf);
  };

  function onLocationChange(loc: string) {
	setFilters((prev) => ({ ...prev, degree: loc }));
  }

  useImperativeHandle(ref, () => ({
	show(filters) {
	  if (filters)
		setFilters(filters);
	  setIsOpened(true);
	},
	getFilters() {
	  return filters;
	},
  }))

  return (
	<div className={`${styles.modalOverlay} ${isOpened ? styles.open : styles.close}`} onClick={onClose}>
	  <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
		<section className={styles.filterSection}>
		  <h3 className={styles.filterTitle}>Years of Experience</h3>
		  <div className={styles.checkboxGroup}>
			{["No experience", "1-4 years", "4-7 years", "8+ years"].map((exp) => (
			  <label key={exp} className={styles.checkboxLabel}>
				<input
				  type="checkbox"
				  checked={filters.experience.includes(exp)}
				  onChange={() => toggleExperience(exp)}
				  className={styles.checkbox}
				/>
				{exp}
			  </label>
			))}
		  </div>
		</section>

		<section className={styles.filterSection}>
		  <h3 className={styles.filterTitle}>Skills</h3>
		  <form onSubmit={addSkill} className={styles.skillInputDiv}>
			<InputField
			  ref={skillInput}
			  type="text"
			  placeholder="Skill"
			  className={styles.skillInput}
			  name="skill"
			/>
			<BaseButton type="submit" icon={<Plus />} className={`${buttonStyles.primaryButton} ${styles.addButton}`} />
		  </form>
		  {filters.skills.length > 0 ?
			<div className={styles.addedSkills}>
			  <p className={styles.addedSkillsLabel}>Added skills:</p>
			  <div className={styles.skillTags}>
				{filters.skills.map((skill) => (
				  <span key={skill} className={styles.skillTag}>
					{skill}
					<BaseButton
					  icon={<Cross />}
					  className={styles.removeSkillBtn}
					  onClick={() => removeSkill(skill)} />
				  </span>
				))}
			  </div>
			</div>
			: ""}
		</section>

		<section className={styles.filterSection}>
		  <h3 className={styles.filterTitle}>Degree</h3>
		  <div className={styles.locationInputDiv}>
			<InputField
			  type="text"
			  placeholder="Location"
			  className={styles.locationInput}
			  value={filters.degree}
			  onChange={onLocationChange}
			/>
		  </div>
		</section>
	  </div>
	</div>
  );
});


export const SearchCandidatesPage: FC<ISearchCandidatesPageProps> = (_) => {
  const [candidates, setCandidates] = useState<ICandidatePosting[]>([
	{
	  name: "Ava Thompson",
	  email: "ava.thompson@example.com",
	  phone: "+61 412 345 678",
	  yoe: 2,
	  degree: "Bachelor of Information Technology",
	  university: "UNSW Sydney",
	  skills: ["React", "JavaScript", "CSS"],
	  id: 1
	},
	{
	  id: 2,
	  name: "Noah Patel",
	  email: "noah.patel@example.com",
	  phone: "+61 423 567 890",
	  yoe: 5,
	  degree: "Bachelor of Software Engineering",
	  university: "University of Sydney",
	  skills: ["TypeScript", "Node.js", "AWS"],
	},
	{
	  id: 3,
	  name: "Mia Chen",
	  email: "mia.chen@example.com",
	  phone: "+61 431 234 567",
	  yoe: 3,
	  degree: "Bachelor of Computer Science",
	  university: "Monash University",
	  skills: ["Python", "Django", "SQL"],
	},
	{
	  id: 4,
	  name: "Liam Smith",
	  email: "liam.smith@example.com",
	  phone: "+61 433 210 987",
	  yoe: 7,
	  degree: "Bachelor of Engineering (Software)",
	  university: "RMIT University",
	  skills: ["Java", "Spring", "Kubernetes"],
	},
	{
	  id: 5,
	  name: "Sofia Nguyen",
	  email: "sofia.nguyen@example.com",
	  phone: "+61 412 987 654",
	  yoe: 1,
	  degree: "Bachelor of Information Systems",
	  university: "Macquarie University",
	  skills: ["HTML", "CSS", "Figma"],
	},
	{
	  id: 6,
	  name: "Elijah Martin",
	  email: "elijah.martin@example.com",
	  phone: "+61 425 678 123",
	  yoe: 4,
	  degree: "Bachelor of Data Science",
	  university: "University of Melbourne",
	  skills: ["Python", "Pandas", "Machine Learning"],
	},
	{
	  id: 7,
	  name: "Grace Lee",
	  email: "grace.lee@example.com",
	  phone: "+61 414 321 765",
	  yoe: 6,
	  degree: "Bachelor of Cyber Security",
	  university: "Deakin University",
	  skills: ["Network Security", "Linux", "Penetration Testing"],
	},
	{
	  id: 8,
	  name: "Lucas Brown",
	  email: "lucas.brown@example.com",
	  phone: "+61 411 234 890",
	  yoe: 8,
	  degree: "Bachelor of Computer Engineering",
	  university: "University of Technology Sydney",
	  skills: ["C++", "Embedded Systems", "IoT"],
	},
	{
	  id: 9,
	  name: "Chloe Davis",
	  email: "chloe.davis@example.com",
	  phone: "+61 426 543 210",
	  yoe: 2,
	  degree: "Bachelor of UX Design",
	  university: "University of Adelaide",
	  skills: ["Figma", "User Research", "Prototyping"],
	},
	{
	  id: 10,
	  name: "Ethan Wilson",
	  email: "ethan.wilson@example.com",
	  phone: "+61 427 890 123",
	  yoe: 10,
	  degree: "Bachelor of Software Engineering",
	  university: "University of Queensland",
	  skills: ["Azure", "DevOps", "C#"],
	}])
  const candidateDetailModal = useRef<ICandidateDetailModalHandle>(null);
  const filtersModal = useRef<IFilterPopupHandle>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("Job title");
  const [searchQuery, setSearchQuery] = useState("");
  const filters = useRef<IFilters>({
	experience: [],
	skills: [],
	degree: ""
  })

  const jobTitles = ["Job title", "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Data Scientist"];

  function onSearchChange(value: string) {
	setSearchQuery(value);
	setCandidates((prev) => prev.filter(v => v.name.toLowerCase().includes(value.toLowerCase())));
  }

  function onFiltersClose(f: IFilters) {
	filters.current = f;
  }

  return (
	<>
	  <CandidateDetailModal ref={candidateDetailModal} />
	  <FilterPopup onFiltersClose={onFiltersClose} ref={filtersModal} />
	  <div className={styles.container}>
		<div className={styles.searchSection}>
		  <h1 className={styles.pageTitle}>Search candidates</h1>
		  <div className={styles.searchDiv}>
			<InputField
			  type="text"
			  placeholder="Search..."
			  className={styles.searchInput}
			  onChange={onSearchChange}
			  value={searchQuery}
			/>
			<BaseButton className={`${buttonStyles.primaryButton} ${styles.searchButton}`} icon={<Search />} />
		  </div>
		  <div className={styles.filterControls}>
			<BaseButton
			  className={styles.filtersButton}
			  onClick={() => filtersModal.current?.show(filters.current)}>
			  Filters
			</BaseButton>
			<div className={styles.recommendedSection}>
			  <label className={styles.recommendedLabel}>Show recommended for</label>
			  <select 
				className={styles.jobTitleDropdown}
				value={selectedJobTitle}
				onChange={(e) => setSelectedJobTitle(e.target.value)}>
				{jobTitles.map((title) => (
				  <option key={title} value={title}>
					{title}
				  </option>
				))}
			  </select>
			</div>
		  </div>
		</div>

		<div className={styles.jobsList}>
		  {candidates.map((job) => (
			<CandidatePostingCard
			  key={job.id}
			  candidate={job}
			  onClick={() => candidateDetailModal.current?.show(job)}
			/>
		  ))}
		</div>
	  </div>
	</>
  );
};