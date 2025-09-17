
import { Major } from './types';

export const MAJORS = [Major.GRAPHIC_DESIGN, Major.INTERIOR_DESIGN];

export const YEARS = ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'];

export const COURSES: { [key in Major]: string[] } = {
  [Major.GRAPHIC_DESIGN]: ['Tipografía I', 'Diseño Editorial', 'Branding', 'Diseño Web', 'Animación Digital'],
  [Major.INTERIOR_DESIGN]: ['Dibujo Técnico', 'Historia del Arte', 'Diseño de Mobiliario', 'Iluminación', 'Proyectos Finales'],
};

export const DESCRIPTION_CHAR_LIMIT = 150;
