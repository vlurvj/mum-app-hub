
import React, { useState, useMemo, useCallback } from 'react';
import { Project, View, Major, Filters } from './types';
import { MAJORS, YEARS, COURSES } from './constants';
import PostCard from './components/PostCard';
import { UploadIcon, FeedIcon, CheckCircleIcon } from './components/icons';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.UPLOAD);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<Filters>({ major: 'all', year: 'all', course: 'all' });

  const addProject = (project: Project) => {
    setProjects(prevProjects => [project, ...prevProjects]);
  };
  
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const majorMatch = filters.major === 'all' || p.major === filters.major;
      const yearMatch = filters.year === 'all' || p.year === filters.year;
      const courseMatch = filters.course === 'all' || p.course === filters.course;
      return majorMatch && yearMatch && courseMatch;
    });
  }, [projects, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const courseOptions = useMemo(() => {
    if (filters.major in COURSES) {
      return COURSES[filters.major as Major];
    }
    return [];
  }, [filters.major]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-10">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Project Hub</h1>
          <div className="flex items-center space-x-2">
            <NavButton
              label="Subir Proyecto"
              icon={<UploadIcon className="w-5 h-5" />}
              isActive={activeView === View.UPLOAD}
              onClick={() => setActiveView(View.UPLOAD)}
            />
            <NavButton
              label="Ver Proyectos"
              icon={<FeedIcon className="w-5 h-5" />}
              isActive={activeView === View.FEED}
              onClick={() => setActiveView(View.FEED)}
            />
          </div>
        </nav>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {activeView === View.UPLOAD && <UploadView addProject={addProject} switchView={() => setActiveView(View.FEED)} />}
        {activeView === View.FEED && (
          <FeedView 
            projects={filteredProjects} 
            filters={filters} 
            onFilterChange={handleFilterChange}
            courseOptions={courseOptions}
          />
        )}
      </main>
    </div>
  );
};

// --- Sub-components to avoid re-rendering issues ---

interface NavButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

interface UploadViewProps {
  addProject: (project: Project) => void;
  switchView: () => void;
}

const UploadView: React.FC<UploadViewProps> = ({ addProject, switchView }) => {
    const [studentName, setStudentName] = useState('');
    const [major, setMajor] = useState<Major | ''>('');
    const [year, setYear] = useState('');
    const [course, setCourse] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!studentName || !major || !year || !course || !description || !file) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        const sanitizedName = studentName.trim().replace(/\s+/g, '_').toLowerCase();
        const newFileName = `${sanitizedName}.${fileExtension}`;
        const filePath = `${major}/${year}/${course}/`;

        const newProject: Project = {
            id: new Date().toISOString(),
            studentName: studentName.trim(),
            major,
            year,
            course,
            description,
            file,
            fileURL: URL.createObjectURL(file),
            fileType: file.type.startsWith('image/') ? 'image' : 'video',
            fileName: newFileName,
            filePath: filePath,
        };

        addProject(newProject);
        setSuccessMessage('¡Tu proyecto se subió correctamente!');

        // Reset form
        setStudentName('');
        setMajor('');
        setYear('');
        setCourse('');
        setDescription('');
        setFile(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';

        setTimeout(() => {
            setSuccessMessage('');
            switchView();
        }, 3000);
    };

    const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newMajor = e.target.value as Major;
      setMajor(newMajor);
      setCourse(''); // Reset course when major changes
    };

    const availableCourses = major ? COURSES[major] : [];

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Subir Nuevo Proyecto</h2>
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 flex items-center space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    <p className="font-semibold">{successMessage}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput label="Nombre y Apellido" value={studentName} onChange={e => setStudentName(e.target.value)} required />
                <FormSelect label="Carrera" value={major} onChange={handleMajorChange} options={MAJORS} required />
                <FormSelect label="Año de la Carrera" value={year} onChange={e => setYear(e.target.value)} options={YEARS} disabled={!major} required />
                <FormSelect label="Curso" value={course} onChange={e => setCourse(e.target.value)} options={availableCourses} disabled={!year} required />
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción del Proyecto</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="form-input" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Archivo (Foto o Video)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    <span>Sube un archivo</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*,video/*" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
                                </label>
                                <p className="pl-1">o arrástralo aquí</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{file ? file.name : 'PNG, JPG, GIF, MP4 hasta 10MB'}</p>
                        </div>
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50" disabled={!!successMessage}>
                    Subir Proyecto
                </button>
            </form>
        </div>
    );
};

interface FeedViewProps {
  projects: Project[];
  filters: Filters;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  courseOptions: string[];
}

const FeedView: React.FC<FeedViewProps> = ({ projects, filters, onFilterChange, courseOptions }) => {
    return (
        <div>
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-8 sticky top-20 z-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FilterSelect name="major" label="Carrera" value={filters.major} onChange={onFilterChange} options={MAJORS} />
                    <FilterSelect name="year" label="Año" value={filters.year} onChange={onFilterChange} options={YEARS} />
                    <FilterSelect name="course" label="Curso" value={filters.course} onChange={onFilterChange} options={courseOptions} disabled={courseOptions.length === 0} />
                </div>
            </div>

            {projects.length > 0 ? (
                <div className="space-y-8">
                    {projects.map(p => <PostCard key={p.id} project={p} />)}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No hay proyectos para mostrar</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Intenta cambiar los filtros o sube un nuevo proyecto.</p>
                </div>
            )}
        </div>
    );
};


// --- Form Helper Components ---

interface FormInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}
const FormInput: React.FC<FormInputProps> = ({ label, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <input type="text" value={value} onChange={onChange} className="form-input" required={required} />
    <style jsx>{`
      .form-input {
        display: block;
        width: 100%;
        border-radius: 0.5rem;
        border-width: 1px;
        border-color: #d1d5db; /* gray-300 */
        padding: 0.75rem 1rem;
        background-color: #f9fafb; /* gray-50 */
      }
      .dark .form-input {
        background-color: #374151; /* gray-700 */
        border-color: #4b5563; /* gray-600 */
        color: #f3f4f6; /* gray-100 */
      }
      .form-input:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        border-color: #3b82f6; /* blue-500 */
        box-shadow: 0 0 0 2px #3b82f6; /* ring-blue-500 */
      }
    `}</style>
  </div>
);


interface FormSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  disabled?: boolean;
  required?: boolean;
}
const FormSelect: React.FC<FormSelectProps> = ({ label, value, onChange, options, disabled, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <select value={value} onChange={onChange} className="form-input" disabled={disabled} required={required}>
            <option value="" disabled>{`Seleccionar ${label.toLowerCase()}`}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
         <style jsx>{`
          .form-input {
            display: block;
            width: 100%;
            border-radius: 0.5rem;
            border-width: 1px;
            border-color: #d1d5db; /* gray-300 */
            padding: 0.75rem 1rem;
            background-color: #f9fafb; /* gray-50 */
          }
          .dark .form-input {
            background-color: #374151; /* gray-700 */
            border-color: #4b5563; /* gray-600 */
            color: #f3f4f6; /* gray-100 */
          }
          .form-input:focus {
            outline: 2px solid transparent;
            outline-offset: 2px;
            border-color: #3b82f6; /* blue-500 */
            box-shadow: 0 0 0 2px #3b82f6; /* ring-blue-500 */
          }
           .form-input:disabled {
             background-color: #e5e7eb; /* gray-200 */
             cursor: not-allowed;
           }
          .dark .form-input:disabled {
             background-color: #4b5563; /* gray-600 */
           }
        `}</style>
    </div>
);

interface FilterSelectProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  disabled?: boolean;
}
const FilterSelect: React.FC<FilterSelectProps> = ({ name, label, value, onChange, options, disabled }) => (
  <div>
    <label htmlFor={name} className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
    >
      <option value="all">Todos</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);


export default App;
