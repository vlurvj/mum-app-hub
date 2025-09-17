
import React from 'react';
import { Project } from '../types';
import { DESCRIPTION_CHAR_LIMIT } from '../constants';

interface PostCardProps {
  project: Project;
}

const PostCard: React.FC<PostCardProps> = ({ project }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const truncatedDescription =
    project.description.length > DESCRIPTION_CHAR_LIMIT
      ? project.description.substring(0, DESCRIPTION_CHAR_LIMIT) + '...'
      : project.description;

  const toggleExpand = () => {
    if (project.description.length > DESCRIPTION_CHAR_LIMIT) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden w-full max-w-lg mx-auto">
      <div className="p-4">
        <p className="font-bold text-gray-800 dark:text-gray-100">{project.studentName}</p>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span>{project.major}</span> &bull; <span>{project.year}</span> &bull; <span>{project.course}</span>
        </div>
      </div>

      <div className="w-full aspect-square bg-gray-100 dark:bg-gray-900">
        {project.fileType === 'image' ? (
          <img src={project.fileURL} alt={project.description} className="w-full h-full object-cover" />
        ) : (
          <video src={project.fileURL} controls className="w-full h-full object-cover" />
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold text-gray-800 dark:text-gray-100">{project.studentName}</span>{' '}
          {isExpanded ? project.description : truncatedDescription}
          {project.description.length > DESCRIPTION_CHAR_LIMIT && (
            <button onClick={toggleExpand} className="text-blue-500 text-sm ml-1 hover:underline">
              {isExpanded ? 'ver menos' : 'ver más'}
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
