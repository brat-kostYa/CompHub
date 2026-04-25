import { Spinner as BsSpinner } from 'react-bootstrap';

interface Props {
    fullPage?: boolean;
}

const Spinner = ({ fullPage = false }: Props) => {
    if (fullPage) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <BsSpinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Завантаження...</span>
                </BsSpinner>
            </div>
        );
    }

    return (
        <BsSpinner animation="border" variant="primary" size="sm" role="status">
            <span className="visually-hidden">Завантаження...</span>
        </BsSpinner>
    );
};

export default Spinner;