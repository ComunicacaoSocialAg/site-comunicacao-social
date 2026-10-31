import './case-brand-signature.css';

export default function CaseBrandSignature({ client, clientLogo }) {
  return <div className="case-brand-signature" aria-label={`Comunicação Social Ag e ${client}`}>
    <div className="case-brand-agency" aria-hidden="true">
      <img src="/assets/brand/balao-amarelo.png" alt="" />
      <img src="/assets/brand/balao-preto.png" alt="" />
    </div>
    <span className="case-brand-plus" aria-hidden="true" />
    <img className="case-brand-client" src={clientLogo} alt="" aria-hidden="true" />
  </div>;
}
