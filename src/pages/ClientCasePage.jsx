import DubolaCasePage from './DubolaCasePage';
import VerdaoShowcasePage from './VerdaoShowcasePage';
import AlbertoShowcasePage from './AlbertoShowcasePage';

export default function ClientCasePage({ caseStudy, onClose, onContact }) {
  if (caseStudy?.id === 'alberto-brasil') {
    return <AlbertoShowcasePage onClose={onClose} onContact={onContact} />;
  }
  if (caseStudy?.id === 'verdao') {
    return <VerdaoShowcasePage onClose={onClose} onContact={onContact} />;
  }
  return <DubolaCasePage onClose={onClose} onContact={onContact} />;
}
