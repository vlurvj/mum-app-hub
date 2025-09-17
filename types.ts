
export enum Major {
  GRAPHIC_DESIGN = 'Diseño Gráfico',
  INTERIOR_DESIGN = 'Diseño de Interiores',
}

export enum View {
  UPLOAD = 'UPLOAD',
  FEED = 'FEED',
}

export interface Project {
  id: string;
  studentName: string;
  major: Major;
  year: string;
  course: string;
  description: string;
  file: File;
  fileURL: string;
  fileType: 'image' | 'video';
  fileName: string;
  filePath: string;
}

export interface Filters {
  major: string;
  year: string;
  course: string;
}
