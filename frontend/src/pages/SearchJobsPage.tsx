import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import styles from "../css/searchPage.module.css";
import buttonStyles from "../css/baseButton.module.css";
import { InputField, InputFieldHandle } from "../components/InputField";
import { BaseButton } from "../components/BaseButton";
import { Cross, Plus, Search } from "../components/Icons";

type RecommendedJob = {
  job_title: string;
  company_name: string;
  description: string;
  work_mode: string;
  required_yoe: number;
  required_skills: string;
  required_degree: string;
  location: string;
  score: number;
};

interface ISearchJobsPageProps { }

interface IJobPosting {
	id: number;
	title: string;
	company: string;
	description: string;
	workMode: string;
	location: string;
	contactEmail: string;
	yoe: number;
	skills: string[];
	degree: string;
}

const JobPostingCard: FC<{ job: IJobPosting; onClick: () => void }> = ({ job, onClick }) => {
	return (
		<div className={styles.jobCard} onClick={onClick}>
			<h2 className={styles.jobTitle}>{job.title}</h2>
			<p className={styles.companyName}>{job.company}</p>
			<p className={styles.jobDescription}>{job.description}</p>
			<p className={styles.jobMeta}>
				{job.workMode} | {job.location}
			</p>
		</div>
	);
};

interface IJobDetailModalProps {
}
interface IJobDetailModalHandle {
	show: (job: IJobPosting) => void
}

const JobDetailModal = forwardRef<IJobDetailModalHandle, IJobDetailModalProps>((_, ref) => {
	const [job, setJob] = useState<IJobPosting | undefined>(undefined)
	const [isOpened, setIsOpened] = useState<boolean>(false);

	function onClose(e?: React.MouseEvent) {
		e?.preventDefault();
		setIsOpened(false);
	}

	useImperativeHandle(ref, () => ({
		show(job) {
			setJob(job);
			setIsOpened(true);
		},
	}));

	return (
		<div className={`${styles.modalOverlay} ${isOpened ? styles.open : styles.close}`} onClick={onClose}>
			{job ?
				<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

					<h1 className={styles.modalTitle}>{job.title}</h1>
					<p className={styles.modalCompany}>{job.company}</p>

					<section className={styles.modalSection}>
						<h3 className={styles.sectionTitle}>Description</h3>
						<p className={styles.sectionText}>{job.description}</p>
					</section>

					<section className={styles.modalSection}>
						<h3 className={styles.sectionTitle}>Employer contact information</h3>
						<p className={styles.sectionText}>{job.contactEmail}</p>
					</section>

					<section className={styles.modalSection}>
						<h3 className={styles.sectionTitle}>Work mode</h3>
						<p className={styles.sectionText}>{job.workMode}</p>
					</section>

					<section className={styles.modalSection}>
						<h3 className={styles.sectionTitle}>Required YOE</h3>
						<p className={styles.sectionText}>{job.yoe}</p>
					</section>

					<section className={styles.modalSection}>
						<h3 className={styles.sectionTitle}>Required Skills</h3>
						<p className={styles.sectionText}>{job.skills?.join(", ")}</p>
					</section>

					<section className={styles.modalSection}>
						<h3 className={styles.sectionTitle}>Required Degree</h3>
						<p className={styles.sectionText}>{job.degree}</p>
					</section>

					<section className={styles.modalSection}>
						<h3 className={styles.sectionTitle}>Location</h3>
						<p className={styles.sectionText}>{job.location}</p>
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
	workMode: string[],
	skills: string[],
	location: string,
}

const FilterPopup = forwardRef<IFilterPopupHandle, FilterPopupProps>((props, ref) => {
	const [filters, setFilters] = useState<IFilters>({
		experience: [],
		workMode: [],
		skills: [],
		location: ""
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

	const toggleWorkMode = (mode: string) => {
		let nf = { ...filters };
		if (nf.workMode.includes(mode))
			nf.workMode = nf.workMode.filter((e) => e !== mode)
		else
			nf.workMode = [...nf.workMode, mode]
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
		setFilters((prev) => ({ ...prev, location: loc }));
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
					<h3 className={styles.filterTitle}>Work mode</h3>
					<div className={styles.checkboxGroup}>
						{["Hybrid", "On-site", "Remote"].map((mode) => (
							<label key={mode} className={styles.checkboxLabel}>
								<input
									type="checkbox"
									checked={filters.workMode.includes(mode)}
									onChange={() => toggleWorkMode(mode)}
									className={styles.checkbox}
								/>
								{mode}
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
					<h3 className={styles.filterTitle}>Location</h3>
					<div className={styles.locationInputDiv}>
						<InputField
							type="text"
							placeholder="Location"
							className={styles.locationInput}
							value={filters.location}
							onChange={onLocationChange}
						/>
					</div>
				</section>
			</div>
		</div>
	);
});

export const SearchJobsPage: FC<ISearchJobsPageProps> = (_) => {
	const [jobs, setJobs] = useState<IJobPosting[]>([]);
	const jobDetailModal = useRef<IJobDetailModalHandle>(null);
	const filtersModal = useRef<IFilterPopupHandle>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const filters = useRef<IFilters>({
		experience: [],
		workMode: [],
		skills: [],
		location: ""
	})
	useEffect(() => {
		const email = localStorage.getItem('email')

		if (!email) {
		console.error('No logged-in email found')
		return
		}

		fetch(`http://127.0.0.1:8000/api/recommendations/jobs/?email=${email}`)
			.then((response) => response.json())
			.then((data) => {
			const apiJobs: IJobPosting[] = (data.recommended_jobs || []).map(
				(job: RecommendedJob, index: number) => ({
				id: index + 1,
				title: job.job_title,
				company: job.company_name,
				description: job.description,
				workMode: job.work_mode,
				location: job.location,
				contactEmail: "",
				yoe: job.required_yoe,
				skills: job.required_skills
					? job.required_skills.split(",").map((skill) => skill.trim())
					: [],
				degree: job.required_degree,
				})
			);

			setJobs(apiJobs);
			})
			.catch((error) => {
			console.error("Failed to load recommended jobs:", error);
			});
		}, []);

	function onSearchChange(value: string) {
		setSearchQuery(value);
	}

	function onFiltersClose(f: IFilters) {
		filters.current = f;
	}

	return (
		<>
			<JobDetailModal ref={jobDetailModal} />
			<FilterPopup onFiltersClose={onFiltersClose} ref={filtersModal} />
			<div className={styles.container}>
				<div className={styles.searchSection}>
					<h1 className={styles.pageTitle}>Search jobs</h1>
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
					<BaseButton
						className={styles.filtersButton}
						onClick={() => filtersModal.current?.show(filters.current)}
					>
						Filters
					</BaseButton>
				</div>

				<div className={styles.jobsList}>
					{jobs.map((job) => (
						<JobPostingCard
							key={job.id}
							job={job}
							onClick={() => jobDetailModal.current?.show(job)}
						/>
					))}
				</div>
			</div>
		</>
	);
};