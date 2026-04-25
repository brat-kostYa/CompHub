import { useEffect, useState } from 'react';
import { BsArrowUp } from 'react-icons/bs';

const BackToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Прокрутити вгору"
        >
            <BsArrowUp size={18} />
        </button>
    );
};

export default BackToTopButton;