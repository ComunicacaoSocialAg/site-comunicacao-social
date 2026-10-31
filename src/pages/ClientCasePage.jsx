import DubolaCasePage from './DubolaCasePage';
import VerdaoShowcasePage from './VerdaoShowcasePage';

export default function ClientCasePage({ caseStudy, onClose, onContact }) {
  if (caseStudy?.id === 'verdao') {
    return <VerdaoShowcasePage onClose={onClose} onContact={onContact} />;
  }
  return <DubolaCasePage onClose={onClose} onContact={onContact} />;
}
