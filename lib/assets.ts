import heroPerspectivePrism from '@/src/assets/images/hero_perspective_prism_1795454370055.jpg';
import catWorkplaceHiring from '@/src/assets/images/cat_workplace_hiring_1795454370987.jpg';
import catEducationStem from '@/src/assets/images/cat_education_stem_1795454370552.jpg';
import catLeadershipBoardroom from '@/src/assets/images/cat_leadership_boardroom_1795454370993.jpg';
import catEverydayLife from '@/src/assets/images/cat_everyday_life_1795454370684.jpg';
import type { StaticImageData } from 'next/image';
import type { ScenarioCategory } from './types';

export const HERO_IMAGE = heroPerspectivePrism;

export const CATEGORY_IMAGES: Record<ScenarioCategory, StaticImageData> = {
  'Workplace & hiring': catWorkplaceHiring,
  Education: catEducationStem,
  Leadership: catLeadershipBoardroom,
  Technology: catWorkplaceHiring,
  'Daily life': catEverydayLife,
  Sports: catLeadershipBoardroom,
};
