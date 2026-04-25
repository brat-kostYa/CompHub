import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ActionLink {
    label: string;
    to: string;
}

interface ActionButton {
    label: string;
    onClick: () => void;
}

interface Props {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ActionLink | ActionButton;
}

const isLink = (action: ActionLink | ActionButton): action is ActionLink =>
    'to' in action;

const EmptyState = ({ icon, title, description, action }: Props) => (
    <div className="text-center py-5 text-muted">
        {icon && <div className="mb-3 fs-1 opacity-50">{icon}</div>}
        <p className="fs-5 fw-semibold mb-1">{title}</p>
        {description && <p className="small mb-4">{description}</p>}
        {action && (
            isLink(action)
                ? <Link to={action.to} className="btn btn-primary">{action.label}</Link>
                : <Button variant="primary" onClick={action.onClick}>{action.label}</Button>
        )}
    </div>
);

export default EmptyState;