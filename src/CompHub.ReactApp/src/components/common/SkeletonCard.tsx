import { Card } from 'react-bootstrap';

const SkeletonCard = () => (
    <Card className="h-100 shadow-sm border-0" aria-hidden="true">
        <div
            className="placeholder-glow"
            style={{ height: '180px', background: '#f8f9fa', borderRadius: '0.375rem 0.375rem 0 0' }}
        >
            <span className="placeholder w-100 h-100 d-block" style={{ borderRadius: '0.375rem 0.375rem 0 0' }} />
        </div>
        <Card.Body className="d-flex flex-column gap-2">
            <span className="placeholder col-5 placeholder-sm" />
            <span className="placeholder col-9" />
            <span className="placeholder col-4 placeholder-sm" />
            <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                <span className="placeholder col-4" />
                <span className="placeholder col-3 btn disabled" />
            </div>
        </Card.Body>
    </Card>
);

export default SkeletonCard;