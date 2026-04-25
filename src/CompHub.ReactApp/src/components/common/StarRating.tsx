import { useState } from 'react';
import { BsStar, BsStarFill } from 'react-icons/bs';

interface Props {
    value: number;
    onChange: (value: number) => void;
    size?: number;
}

const StarRating = ({ value, onChange, size = 28 }: Props) => {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    return (
        <div className="d-inline-flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    role="button"
                    aria-label={`${star} ${star === 1 ? 'зірка' : star < 5 ? 'зірки' : 'зірок'}`}
                    className={active >= star ? 'text-warning' : 'text-secondary'}
                    style={{ cursor: 'pointer', transition: 'color 0.1s' }}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(star)}
                >
                    {active >= star ? <BsStarFill size={size} /> : <BsStar size={size} />}
                </span>
            ))}
        </div>
    );
};

export default StarRating;