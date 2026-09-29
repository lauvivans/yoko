import { Link, type To } from 'react-router';

interface InfoCardProps {
  title: string;
  desc: string;
  to: To;
  isDisabled?: boolean;
}

const InfoCard = ({ title, desc, to, isDisabled = false }: InfoCardProps) => {
  return (
    <article className={`c-info-card ${isDisabled && 'c-info-card--disabled'}`}>
      <Link to={to}>
        <h2 className="c-info-card__title">{title}</h2>
        <p className="c-info-card__desc">{desc}</p>
      </Link>
    </article>
  );
};

export default InfoCard;
