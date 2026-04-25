import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';

interface Props {
    rating: number | null;
    size?: number;
}

const StarDisplay = ({ rating, size = 16 }: Props) => (
    <span className="text-warning">
        {[1, 2, 3, 4, 5].map((star) => {
            const r = rating ?? 0;
            if (r >= star) return <BsStarFill key={star} size={size} />;
            if (r >= star - 0.5) return <BsStarHalf key={star} size={size} />;
            return <BsStar key={star} size={size} />;
        })}
    </span>
);

export default StarDisplay;