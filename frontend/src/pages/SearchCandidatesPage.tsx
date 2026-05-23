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
	prefferedWorkingMode:string
	location:string
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

					<section className={styles.modalSection}>
						<h3 className={styles.sectionTitle}>Preffered working mode</h3>
						<p className={styles.sectionText}>{candidate.prefferedWorkingMode}</p>
					</section>

					<section className={styles.modalSection}>
						<h3 className={styles.sectionTitle}>Location</h3>
						<p className={styles.sectionText}>{candidate.location}</p>
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
	experience: number[],
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

	const toggleExperience = (exp: number) => {
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
						{["No experience", "1-4 years", "4-7 years", "8+ years"].map((exp, i) => (
							<label key={exp} className={styles.checkboxLabel}>
								<input
									type="checkbox"
									checked={filters.experience.includes(i)}
									onChange={() => toggleExperience(i)}
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
							placeholder="Degree"
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
	const [candidates, setCandidates] = useState<ICandidatePosting[]>([])
	const candidateDetailModal = useRef<ICandidateDetailModalHandle>(null);
	const filtersModal = useRef<IFilterPopupHandle>(null);
	const [selectedJobTitle, setSelectedJobTitle] = useState("Job title");
	const filters = useRef<IFilters>({
		experience: [],
		skills: [],
		degree: ""
	})
	const jobTitles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Data Scientist"];
	const searchInput = useRef<string>("");

	async function performSearch(searchString: string, searchFilters: IFilters) {
		try {
			const params = new URLSearchParams();

			if (searchString) params.append('search', searchString);
			if (searchFilters.experience.length > 0) params.append('experience', searchFilters.experience.join(','));
			if (searchFilters.degree.length > 0) params.append('degree', searchFilters.degree);
			if (searchFilters.skills.length > 0) params.append('skills', searchFilters.skills.join(','));

			const response = await fetch(`/api/candidates/search/?${params}`);
			if (!response.ok) {
				throw new Error('Failed to search jobs');
			}

			const data = await response.json();
			setCandidates(data.candidates ?? []);
		} catch (error) {
			console.error('Search error:', error);
			setCandidates([]);
		}
	}

	function onSearch(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries()) as any;
		searchInput.current = data.search;
		performSearch(data.search, filters.current);
	}

	function onFiltersClose(f: IFilters) {
		filters.current = f;
		performSearch(searchInput.current, f);
	}

	return (
		<>
			<CandidateDetailModal ref={candidateDetailModal} />
			<FilterPopup onFiltersClose={onFiltersClose} ref={filtersModal} />
			<div className={styles.container}>
				<div className={styles.searchSection}>
					<h1 className={styles.pageTitle}>Search candidates</h1>
					<form onSubmit={onSearch} className={styles.searchDiv}>
						<InputField
							type="text"
							name="search"
							placeholder="Search..."
							className={styles.searchInput}
						/>
						<BaseButton type="submit" className={`${buttonStyles.primaryButton} ${styles.searchButton}`} icon={<Search />} />
					</form>
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
					{candidates.length == 0 ? <p className={styles.noResults}>No candidates found.</p> : ""}
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