import { Button, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useCreateReviewMutation } from './reviewsApi';
import { extractApiError } from '../../hooks/useApiError';
import StarRating from '../../components/common/StarRating';
import type { CreateReviewRequest } from '../../types/review';

interface Props {
    productId: number;
}

interface FormData {
    rating: number;
    comment: string;
}

const ReviewForm = ({ productId }: Props) => {
    const [createReview, { isLoading }] = useCreateReviewMutation();

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormData>({ defaultValues: { rating: 5, comment: '' } });

    const comment = watch('comment');

    const onSubmit = async (data: FormData): Promise<void> => {
        const body: CreateReviewRequest = {
            rating: data.rating,
            comment: data.comment.trim() || undefined,
        };
        const result = await createReview({ productId, body });

        if ('error' in result) {
            toast.error(extractApiError(result.error) ?? 'Не вдалося додати відгук.');
            return;
        }

        toast.success('Відгук додано!');
        reset();
    };

    const RATING_LABELS = ['', 'Жахливо', 'Погано', 'Нормально', 'Добре', 'Відмінно'];

    return (
        <Form onSubmit={handleSubmit(onSubmit)} noValidate className="review-form">
            <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Ваша оцінка</Form.Label>
                <div className="d-flex align-items-center gap-2">
                    <Controller
                        name="rating"
                        control={control}
                        rules={{ required: true, min: 1, max: 5 }}
                        render={({ field }) => (
                            <StarRating value={field.value} onChange={field.onChange} />
                        )}
                    />
                    <small className="text-muted">
                        {RATING_LABELS[watch('rating')]}
                    </small>
                </div>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Коментар <span className="text-muted fw-normal">(необов'язково)</span></Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Ваші враження від товару..."
                    isInvalid={!!errors.comment}
                    {...register('comment', { maxLength: { value: 2000, message: 'Максимум 2000 символів' } })}
                />
                <div className="d-flex justify-content-between mt-1">
                    <Form.Control.Feedback type="invalid">{errors.comment?.message}</Form.Control.Feedback>
                    <small className={`ms-auto ${comment.length > 1800 ? 'text-warning' : 'text-muted'}`}>
                        {comment.length}/2000
                    </small>
                </div>
            </Form.Group>

            <Button type="submit" variant="primary" disabled={isLoading} className="d-flex align-items-center gap-2">
                {isLoading && <span className="spinner-border spinner-border-sm" />}
                Залишити відгук
            </Button>
        </Form>
    );
};

export default ReviewForm;