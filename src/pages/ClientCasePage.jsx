import DubolaCasePage from './DubolaCasePage';
import VerdaoShowcasePage from './VerdaoShowcasePage';
import AlbertoShowcasePage from './AlbertoShowcasePage';
import PontoCorShowcasePage from './PontoCorShowcasePage';
import LiviaEsperShowcasePage from './LiviaEsperShowcasePage';

export default function ClientCasePage({ caseStudy, onClose, onContact }) {
  if (
    caseStudy?.id === 'livia-esper' ||
    caseStudy?.id === 'livia-esper-site' ||
    caseStudy?.id === 'livia-esper-sistema'
  ) {
    return <LiviaEsperShowcasePage onClose={onClose} onContact={onContact} />;
  }
  if (caseStudy?.id === 'ponto-cor') {
    return <PontoCorShowcasePage onClose={onClose} onContact={onContact} />;
  }
  if (caseStudy?.id === 'alberto-brasil') {
    return <AlbertoShowcasePage onClose={onClose} onContact={onContact} />;
  }
  if (caseStudy?.id === 'verdao') {
    return <VerdaoShowcasePage onClose={onClose} onContact={onContact} />;
  }
  return <DubolaCasePage onClose={onClose} onContact={onContact} />;
}
