import './case-brand-signature.css';

export default function CaseBrandSignature({ client, clientLogo }) {
  return (
    <div
      className={`case-brand-signature${client === 'Dubola' ? ' case-brand-signature-dubola' : ''}`}
      aria-label={`Comunicação Social Ag e ${client}`}
    >
      <img
        className="case-brand-agency"
        src="/assets/brand/logo-sem-fundo.png"
        alt="Comunicação Social Ag"
        aria-hidden="true"
      />
      <span className="case-brand-plus" aria-hidden="true" />
      <img className="case-brand-client" src={clientLogo} alt="" aria-hidden="true" />
    </div>
  );
}
