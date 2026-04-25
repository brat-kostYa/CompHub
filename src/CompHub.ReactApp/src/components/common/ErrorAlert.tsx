import { Alert } from 'react-bootstrap';

interface Props {
    message?: string;
}

const ErrorAlert = ({ message = 'Щось пішло не так. Спробуйте пізніше.' }: Props) => {
    return <Alert variant="danger">{message}</Alert>;
};

export default ErrorAlert;